import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronDown, ChevronRight, Plus, Trash2, AlertTriangle, CheckCircle2, FileText, Calculator, ClipboardList, Shield, Target, AlertCircle, Info, X, Edit2, Save, Download, Upload, FileDown, Activity, Sparkles, LogOut, Crown, Lock, FilePlus2 } from 'lucide-react';
import jsPDF from 'jspdf';
import MedicalHistorySystem from './MedicalHistorySystem';
import { useAuth } from './components/AuthProvider';
import { useFeatureLimits, PremiumBadge } from './components/PremiumGate';
import { redirectToCheckout, isStripeConfigured } from './lib/stripe';
import ChatAgent from './components/ChatAgent';
import ShaDbqTab from './components/ShaDbq';

// VA Combined Rating Calculator - Bilateral Factor not included for simplicity
const calculateVARating = (ratings) => {
  if (ratings.length === 0) return 0;
  const sorted = [...ratings].sort((a, b) => b - a);
  let remaining = 100;
  sorted.forEach(rating => {
    remaining = remaining * (1 - rating / 100);
  });
  const combined = 100 - remaining;
  return Math.round(combined / 10) * 10;
};

// Payment estimates (2024 rates, single veteran no dependents)
const getMonthlyPayment = (rating) => {
  const payments = {
    0: 0, 10: 171.23, 20: 338.49, 30: 524.31, 40: 755.28,
    50: 1075.16, 60: 1361.88, 70: 1716.28, 80: 1995.01,
    90: 2241.91, 100: 3737.85
  };
  return payments[rating] || 0;
};

const CollapsibleSection = ({ title, icon: Icon, children, defaultOpen = false, badge, badgeColor = 'emerald' }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const colors = {
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    sky: 'bg-sky-500/20 text-sky-400 border-sky-500/30'
  };
  return (
    <div className="border border-slate-700/50 rounded-lg bg-slate-800/40 backdrop-blur overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-amber-500" />
          <span className="font-semibold text-slate-100 tracking-wide">{title}</span>
          {badge !== undefined && (
            <span className={`px-2 py-0.5 rounded text-xs font-mono border ${colors[badgeColor]}`}>{badge}</span>
          )}
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
      </button>
      {isOpen && <div className="p-4 pt-0 border-t border-slate-700/50">{children}</div>}
    </div>
  );
};

const CheckItem = ({ label, checked, onChange, indent = 0, sublabel }) => (
  <label className={`flex items-start gap-3 py-2 px-3 rounded hover:bg-slate-700/20 cursor-pointer transition-colors ${indent ? 'ml-6' : ''}`}>
    <input type="checkbox" checked={checked} onChange={onChange} className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500/50" />
    <div className="flex-1">
      <span className={`text-sm ${checked ? 'text-slate-400 line-through' : 'text-slate-200'}`}>{label}</span>
      {sublabel && <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>}
    </div>
  </label>
);

const initialChecklist = {
  retirement: {
    title: 'Military Retirement',
    items: [
      { id: 'r1', label: 'Schedule Pre-Separation Counseling', sublabel: 'TAP/TAPS appointment', checked: false },
      { id: 'r2', label: 'Complete DD-214 Worksheet', sublabel: 'Review all entries for accuracy', checked: false },
      { id: 'r3', label: 'Request Certified Copies of Service Records', checked: false },
      { id: 'r4', label: 'Schedule Retirement Physical', sublabel: 'Document ALL conditions', checked: false },
      { id: 'r5', label: 'Obtain Medical Records (Complete Copy)', checked: false },
      { id: 'r6', label: 'Review/Update SGLI & VGLI Coverage', checked: false },
      { id: 'r7', label: 'Verify Retirement Points/Time (Reserve/Guard)', checked: false },
      { id: 'r8', label: 'Complete Survivor Benefit Plan (SBP) Election', checked: false },
      { id: 'r9', label: 'Schedule Final Out-Processing', checked: false },
      { id: 'r10', label: 'Obtain ID Cards for Dependents', checked: false },
    ]
  },
  vaClaim: {
    title: 'VA Disability Claim',
    items: [
      { id: 'v1', label: 'Create eBenefits/VA.gov Account', checked: false },
      { id: 'v2', label: 'File Intent to File (ITF)', sublabel: 'Preserves effective date for 1 year', checked: false },
      { id: 'v3', label: 'Complete VA Form 21-526EZ', sublabel: 'Application for Disability Compensation', checked: false },
      { id: 'v4', label: 'List ALL Conditions (Primary & Secondary)', checked: false },
      { id: 'v5', label: 'Gather Buddy Statements (VA Form 21-10210)', checked: false },
      { id: 'v6', label: 'Obtain DBQs for Each Condition', sublabel: 'Disability Benefits Questionnaires', checked: false },
      { id: 'v7', label: 'Secure Nexus Letters (if needed)', sublabel: 'Links condition to service', checked: false },
      { id: 'v8', label: 'Request C&P Exam (or attend scheduled)', checked: false },
      { id: 'v9', label: 'Submit Personal Statement (VA Form 21-4138)', checked: false },
      { id: 'v10', label: 'Upload All Supporting Evidence', checked: false },
    ]
  },
  medical: {
    title: 'Medical Documentation',
    items: [
      { id: 'm1', label: 'Complete Service Treatment Records (STR)', checked: false },
      { id: 'm2', label: 'All Deployment Health Records', checked: false },
      { id: 'm3', label: 'Line of Duty (LOD) Determinations', checked: false },
      { id: 'm4', label: 'Incident/Accident Reports', checked: false },
      { id: 'm5', label: 'Surgery & Hospitalization Records', checked: false },
      { id: 'm6', label: 'Mental Health Treatment Records', checked: false },
      { id: 'm7', label: 'Physical Therapy Records', checked: false },
      { id: 'm8', label: 'Civilian Medical Records (Post-Service)', checked: false },
      { id: 'm9', label: 'Current Medication List', checked: false },
      { id: 'm10', label: 'Imaging (X-rays, MRIs, CT Scans)', checked: false },
      { id: 'm11', label: 'Lab Results & Bloodwork', checked: false },
      { id: 'm12', label: 'Specialist Consultation Notes', checked: false },
    ]
  },
  benefits: {
    title: 'Benefits & Enrollment',
    items: [
      { id: 'b1', label: 'Enroll in VA Healthcare (VA Form 10-10EZ)', checked: false },
      { id: 'b2', label: 'Apply for GI Bill Benefits (if applicable)', checked: false },
      { id: 'b3', label: 'Register with State Veterans Affairs', checked: false },
      { id: 'b4', label: 'Apply for Vocational Rehab (VR&E) if eligible', checked: false },
      { id: 'b5', label: 'Update Direct Deposit Information', checked: false },
      { id: 'b6', label: 'Apply for CHAMPVA (dependents if 100% P&T)', checked: false },
      { id: 'b7', label: 'Verify Commissary/Exchange Privileges', checked: false },
      { id: 'b8', label: 'Apply for Disabled Veteran License Plates', checked: false },
      { id: 'b9', label: 'Explore Property Tax Exemptions', checked: false },
    ]
  },
  legal: {
    title: 'Legal & Administrative',
    items: [
      { id: 'l1', label: 'Update Will/Estate Documents', checked: false },
      { id: 'l2', label: 'Establish VA Healthcare Power of Attorney', checked: false },
      { id: 'l3', label: 'Update Beneficiary Designations (All Accounts)', checked: false },
      { id: 'l4', label: 'Obtain Copies of Marriage/Divorce Decrees', checked: false },
      { id: 'l5', label: 'Birth Certificates for Dependents', checked: false },
      { id: 'l6', label: 'Secure Financial Records', checked: false },
      { id: 'l7', label: 'Update Address with DFAS', checked: false },
      { id: 'l8', label: 'File Change of Address (USPS)', checked: false },
    ]
  }
};

const documentRequirements = {
  physical: {
    title: 'Physical Injuries',
    icon: '🦴',
    items: [
      'Service Treatment Records showing injury/treatment',
      'LOD determination (if applicable)',
      'X-rays/MRI/CT scans showing damage',
      'Physical therapy records',
      'Surgery records (if applicable)',
      'Current diagnosis from physician',
      'DBQ completed by examiner',
      'Buddy statements describing incident/limitations',
      'Civilian treatment records (continuity of care)'
    ]
  },
  chronic: {
    title: 'Chronic Pain Conditions',
    icon: '⚡',
    items: [
      'Documentation of pain complaints in STRs',
      'Pattern of treatment over time',
      'Current diagnosis with etiology',
      'Pain management records',
      'Functional limitations documented',
      'Medication history showing treatment attempts',
      'Specialist consultations',
      'DBQ with range of motion measurements',
      'Personal statement describing daily impact'
    ]
  },
  mental: {
    title: 'Mental Health Conditions',
    icon: '🧠',
    items: [
      'In-service mental health treatment records',
      'Combat/deployment records (if PTSD)',
      'Stressor statement (VA Form 21-0781)',
      'Current mental health diagnosis',
      'Ongoing treatment records',
      'Medication history for mental health',
      'DBQ for mental disorders',
      'Nexus letter linking to service',
      'Buddy statements about behavioral changes',
      'Personal statement describing symptoms'
    ]
  },
  hearing: {
    title: 'Hearing & Tinnitus',
    icon: '👂',
    items: [
      'Entrance audiogram (baseline)',
      'Separation audiogram (comparison)',
      'In-service audiograms showing decline',
      'MOS/duty documentation (noise exposure)',
      'Current audiological evaluation',
      'Tinnitus diagnosis and DBQ',
      'Personal statement on onset/impact',
      'Buddy statements on noise exposure'
    ]
  },
  sleep: {
    title: 'Sleep Disorders',
    icon: '😴',
    items: [
      'In-service sleep complaints documented',
      'Sleep study results (polysomnography)',
      'Current diagnosis (OSA, insomnia, etc.)',
      'CPAP prescription and compliance data',
      'DBQ for sleep apnea',
      'Nexus letter (especially if secondary)',
      'Weight/BMI history if relevant',
      'Buddy/spouse statements on symptoms'
    ]
  },
  tbi: {
    title: 'Traumatic Brain Injury',
    icon: '🎯',
    items: [
      'Incident documentation (blast, accident)',
      'LOD determination',
      'Initial evaluation after injury',
      'Neurological examination records',
      'Cognitive testing results',
      'Imaging studies (CT/MRI of brain)',
      'TBI-specific DBQ',
      'Current residuals documentation',
      'Buddy statements on cognitive changes',
      'Treatment records for residuals'
    ]
  },
  presumptive: {
    title: 'Presumptive Conditions',
    icon: '📋',
    items: [
      'Proof of qualifying service (deployment orders)',
      'Dates in qualifying location/era',
      'Current diagnosis of presumptive condition',
      'DD-214 showing service dates/locations',
      'Agent Orange registry (if applicable)',
      'Burn pit registry enrollment (if applicable)',
      'DBQ for specific condition',
      'PACT Act eligibility documentation'
    ]
  },
  secondary: {
    title: 'Secondary Conditions',
    icon: '🔗',
    items: [
      'Already service-connected primary condition',
      'Medical evidence linking secondary to primary',
      'Nexus letter (CRITICAL for secondary claims)',
      'Medical literature supporting connection',
      'DBQ for secondary condition',
      'Treatment records showing progression',
      'Physician statement on causation/aggravation'
    ]
  }
};

const ratingDescriptions = {
  0: 'Service-connected but non-compensable',
  10: 'Mild impairment, minimal impact',
  20: 'Moderate symptoms, some limitations',
  30: 'Moderate-severe, noticeable impact on work/life',
  40: 'Considerable impairment, significant limitations',
  50: 'Serious impairment, major functional loss',
  60: 'Severe impairment, substantial disability',
  70: 'Very severe, approaching total disability',
  80: 'Near-total impairment in affected system',
  90: 'Extreme disability, minimal function',
  100: 'Total disability, unemployable due to condition'
};

// Storage key and version for data persistence
const STORAGE_KEY = 'va-prep-data';
const DATA_VERSION = '1.0';

export default function App() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, profile, signOut, isPremium, saveUserData, loadUserData } = useAuth();
  const { maxConditions, maxMedicalEntries, canUseAI, canExportPDF, canExportData } = useFeatureLimits();
  
  const [activeTab, setActiveTab] = useState('checklist');
  const [checklist, setChecklist] = useState(initialChecklist);
  const [conditions, setConditions] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [veteranName, setVeteranName] = useState('');
  const [medicalEntries, setMedicalEntries] = useState([]);
  const [shaDbqData, setShaDbqData] = useState(null);
  const [showConditionForm, setShowConditionForm] = useState(false);
  const [editingCondition, setEditingCondition] = useState(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [suggestedGroups, setSuggestedGroups] = useState([]);
  const [analyzingHistory, setAnalyzingHistory] = useState(false);
  const [generatingCondition, setGeneratingCondition] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [generatedCondition, setGeneratedCondition] = useState(null);
  const [autoSuggestionsCount, setAutoSuggestionsCount] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [newCondition, setNewCondition] = useState({
    name: '', category: 'physical', evidence: '', dbqAvailable: false,
    nexusNeeded: false, inServiceProof: '', severity: 'moderate', estimatedRating: 30, notes: ''
  });

  // Handle upgrade parameter from URL
  useEffect(() => {
    if (searchParams.get('upgrade') === 'true') {
      setShowUpgradeModal(true);
    }
    if (searchParams.get('success') === 'true') {
      alert('Payment successful! Your Premium features are now active.');
    }
  }, [searchParams]);

  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Handle upgrade click
  const handleUpgrade = async () => {
    if (isStripeConfigured && user) {
      await redirectToCheckout(user.email, user.id);
    } else {
      setShowUpgradeModal(true);
    }
  };

  // Auto-detect potential conditions when Conditions tab is loaded
  useEffect(() => {
    if (activeTab === 'conditions' && medicalEntries.length >= 2 && autoSuggestionsCount === 0) {
      // Quick pattern detection without API call
      const bodySystemGroups = {};
      medicalEntries.forEach(entry => {
        const system = entry.bodySystem || 'other';
        if (!bodySystemGroups[system]) bodySystemGroups[system] = [];
        bodySystemGroups[system].push(entry);
      });
      
      const potentialGroups = Object.values(bodySystemGroups).filter(group => group.length >= 2);
      setAutoSuggestionsCount(potentialGroups.length);
    }
  }, [activeTab, medicalEntries, autoSuggestionsCount]);

  // Load saved data - from Supabase if logged in, otherwise localStorage
  useEffect(() => {
    const loadData = async () => {
      // If user is logged in, try to load from Supabase first
      if (user && loadUserData) {
        try {
          const { data: cloudData, error } = await loadUserData();
          if (cloudData && !error) {
            // Load from cloud
            if (cloudData.checklist) setChecklist(cloudData.checklist);
            if (cloudData.conditions) setConditions(cloudData.conditions);
            if (cloudData.ratings) setRatings(cloudData.ratings);
            if (cloudData.veteran_name) setVeteranName(cloudData.veteran_name);
            if (cloudData.medical_entries) setMedicalEntries(cloudData.medical_entries);
            if (cloudData.sha_dbq_data) setShaDbqData(cloudData.sha_dbq_data);
            console.log('Loaded data from cloud');
            return;
          }
        } catch (err) {
          console.error('Failed to load from cloud:', err);
        }
      }

      // Fallback to localStorage
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const data = JSON.parse(saved);
          if (data.version === DATA_VERSION) {
            if (data.checklist) setChecklist(data.checklist);
            if (data.conditions) setConditions(data.conditions);
            if (data.ratings) setRatings(data.ratings);
            if (data.activeTab) setActiveTab(data.activeTab);
            if (data.veteranName) setVeteranName(data.veteranName);
            if (data.medicalEntries) setMedicalEntries(data.medicalEntries);
            if (data.shaDbqData) setShaDbqData(data.shaDbqData);
          }
        }
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    };

    loadData();
  }, [user]);

  // Auto-save data to localStorage and Supabase
  useEffect(() => {
    // Save to localStorage (always, as backup)
    try {
      const dataToSave = {
        version: DATA_VERSION,
        checklist,
        conditions,
        ratings,
        activeTab,
        veteranName,
        medicalEntries,
        shaDbqData,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      if (error.name === 'QuotaExceededError') {
        alert('Storage quota exceeded. Please export your data as a backup.');
      }
    }

    // Save to Supabase if logged in (debounced)
    if (user && saveUserData) {
      const saveToCloud = async () => {
        try {
          await saveUserData({
            checklist,
            conditions,
            ratings,
            medical_entries: medicalEntries,
            veteran_name: veteranName,
            sha_dbq_data: shaDbqData
          });
        } catch (err) {
          console.error('Failed to save to cloud:', err);
        }
      };
      
      // Debounce cloud saves to avoid too many requests
      const timeoutId = setTimeout(saveToCloud, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [checklist, conditions, ratings, activeTab, veteranName, medicalEntries, shaDbqData, user]);

  // Export data as JSON file
  const exportData = () => {
    try {
      const dataToExport = {
        version: DATA_VERSION,
        checklist,
        conditions,
        ratings,
        activeTab,
        veteranName,
        medicalEntries,
        exportedAt: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `va-prep-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  // Import data from JSON file
  const importData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        
        // Validate imported data structure
        if (!imported.version || !imported.checklist) {
          alert('Invalid backup file format.');
          return;
        }

        // Confirm before overwriting
        const confirmImport = window.confirm(
          'This will replace all current data. Are you sure you want to continue?'
        );
        
        if (confirmImport) {
          if (imported.checklist) setChecklist(imported.checklist);
          if (imported.conditions) setConditions(imported.conditions);
          if (imported.ratings) setRatings(imported.ratings);
          if (imported.activeTab) setActiveTab(imported.activeTab);
          if (imported.veteranName) setVeteranName(imported.veteranName);
          if (imported.medicalEntries) setMedicalEntries(imported.medicalEntries);
          alert('Data imported successfully!');
        }
      } catch (error) {
        console.error('Failed to import data:', error);
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  // Generate PDF Report for VSO submission
  const generatePDFReport = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let yPos = margin;

      // Helper function to add new page if needed
      const checkPageBreak = (heightNeeded = 10) => {
        if (yPos + heightNeeded > pageHeight - margin) {
          doc.addPage();
          yPos = margin;
          return true;
        }
        return false;
      };

      // Helper function to add text with word wrap
      const addText = (text, fontSize = 10, isBold = false) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
        lines.forEach(line => {
          checkPageBreak();
          doc.text(line, margin, yPos);
          yPos += fontSize * 0.4;
        });
      };

      // Header
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('VA DISABILITY CLAIM PREPARATION REPORT', pageWidth / 2, yPos, { align: 'center' });
      yPos += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' });
      yPos += 15;

      // Veteran Information Section (blank for manual fill-in)
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('VETERAN INFORMATION', margin, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Name: _______________________________________________', margin, yPos);
      yPos += 7;
      doc.text('SSN/Service Number: __________________________________', margin, yPos);
      yPos += 7;
      doc.text('Branch of Service: ____________________________________', margin, yPos);
      yPos += 7;
      doc.text('Dates of Service: _____________________________________', margin, yPos);
      yPos += 15;

      // Checklist Progress Summary
      checkPageBreak(30);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('PREPARATION CHECKLIST SUMMARY', margin, yPos);
      yPos += 8;

      const categories = Object.entries(checklist);
      categories.forEach(([key, category]) => {
        const items = category.items;
        const checked = items.filter(i => i.checked).length;
        const percent = Math.round((checked / items.length) * 100);
        
        checkPageBreak();
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${category.title}:`, margin, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(`${checked}/${items.length} complete (${percent}%)`, margin + 70, yPos);
        yPos += 6;
      });
      yPos += 10;

      // Conditions and Documentation
      checkPageBreak(30);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('CLAIMED CONDITIONS', margin, yPos);
      yPos += 10;

      if (conditions.length === 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('No conditions tracked yet.', margin, yPos);
        yPos += 10;
      } else {
        conditions.forEach((condition, index) => {
          checkPageBreak(40);
          
          // Condition header
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(`${index + 1}. ${condition.name}`, margin, yPos);
          yPos += 7;

          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          
          // Category and severity
          doc.text(`Category: ${documentRequirements[condition.category]?.title || condition.category}`, margin + 5, yPos);
          yPos += 5;
          doc.text(`Severity: ${condition.severity} | Estimated Rating: ${condition.estimatedRating}%`, margin + 5, yPos);
          yPos += 5;
          doc.text(`DBQ Available: ${condition.dbqAvailable ? 'Yes' : 'No'} | Nexus Letter Needed: ${condition.nexusNeeded ? 'Yes' : 'No'}`, margin + 5, yPos);
          yPos += 7;

          // Evidence
          if (condition.evidence) {
            doc.setFont('helvetica', 'bold');
            doc.text('Evidence/Documentation:', margin + 5, yPos);
            yPos += 5;
            doc.setFont('helvetica', 'normal');
            const evidenceLines = doc.splitTextToSize(condition.evidence, pageWidth - 2 * margin - 10);
            evidenceLines.forEach(line => {
              checkPageBreak();
              doc.text(line, margin + 10, yPos);
              yPos += 4;
            });
            yPos += 3;
          }

          // In-Service Proof
          if (condition.inServiceProof) {
            doc.setFont('helvetica', 'bold');
            doc.text('In-Service Proof:', margin + 5, yPos);
            yPos += 5;
            doc.setFont('helvetica', 'normal');
            const proofLines = doc.splitTextToSize(condition.inServiceProof, pageWidth - 2 * margin - 10);
            proofLines.forEach(line => {
              checkPageBreak();
              doc.text(line, margin + 10, yPos);
              yPos += 4;
            });
            yPos += 3;
          }

          // Notes
          if (condition.notes) {
            doc.setFont('helvetica', 'bold');
            doc.text('Additional Notes:', margin + 5, yPos);
            yPos += 5;
            doc.setFont('helvetica', 'normal');
            const notesLines = doc.splitTextToSize(condition.notes, pageWidth - 2 * margin - 10);
            notesLines.forEach(line => {
              checkPageBreak();
              doc.text(line, margin + 10, yPos);
              yPos += 4;
            });
            yPos += 3;
          }

          yPos += 8;
        });
      }

      // VA Rating Calculation
      checkPageBreak(30);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('ESTIMATED VA RATING', margin, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Combined VA Rating: ${combinedRating}%`, margin, yPos);
      yPos += 6;
      doc.text(`Estimated Monthly Compensation: $${monthlyPayment.toFixed(2)}`, margin, yPos);
      yPos += 6;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text('(Based on 2024 rates, single veteran, no dependents)', margin, yPos);
      yPos += 10;

      // Individual Ratings
      if (ratings.length > 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Individual Condition Ratings:', margin, yPos);
        yPos += 6;
        
        doc.setFont('helvetica', 'normal');
        ratings.forEach(r => {
          checkPageBreak();
          doc.text(`• ${r.name}: ${r.rating}%`, margin + 5, yPos);
          yPos += 5;
        });
        yPos += 10;
      }

      // Next Steps / Recommendations
      checkPageBreak(40);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('RECOMMENDED NEXT STEPS', margin, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      const nextSteps = [];
      if (conditions.filter(c => !c.dbqAvailable).length > 0) {
        nextSteps.push(`• Obtain DBQs for: ${conditions.filter(c => !c.dbqAvailable).map(c => c.name).join(', ')}`);
      }
      if (conditions.filter(c => c.nexusNeeded).length > 0) {
        nextSteps.push(`• Secure nexus letters for: ${conditions.filter(c => c.nexusNeeded).map(c => c.name).join(', ')}`);
      }
      if (conditions.filter(c => !c.evidence.trim()).length > 0) {
        nextSteps.push(`• Document evidence for: ${conditions.filter(c => !c.evidence.trim()).map(c => c.name).join(', ')}`);
      }
      if (totalProgress.percent < 100) {
        nextSteps.push(`• Complete remaining ${totalProgress.total - totalProgress.checked} checklist items`);
      }
      
      if (nextSteps.length === 0) {
        doc.text('All preparation tasks complete. Ready for submission.', margin, yPos);
        yPos += 6;
      } else {
        nextSteps.forEach(step => {
          checkPageBreak();
          const stepLines = doc.splitTextToSize(step, pageWidth - 2 * margin);
          stepLines.forEach(line => {
            doc.text(line, margin, yPos);
            yPos += 5;
          });
        });
      }

      yPos += 10;

      // Footer disclaimer
      checkPageBreak(20);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      const disclaimer = 'This report is for organizational purposes only and does not constitute legal or medical advice. All information should be verified with official VA resources and your VSO.';
      const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 2 * margin);
      disclaimerLines.forEach(line => {
        checkPageBreak();
        doc.text(line, margin, yPos);
        yPos += 4;
      });

      // Generate filename
      const nameForFile = veteranName.trim() ? veteranName.replace(/[^a-z0-9]/gi, '-') : 'Veteran';
      const filename = `VA-Prep-Report-${nameForFile}-${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Save PDF
      doc.save(filename);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    }
  };

  const handleChecklistChange = (category, itemId) => {
    setChecklist(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        items: prev[category].items.map(item =>
          item.id === itemId ? { ...item, checked: !item.checked } : item
        )
      }
    }));
  };

  const getCategoryProgress = (category) => {
    const items = checklist[category].items;
    const checked = items.filter(i => i.checked).length;
    return { checked, total: items.length, percent: Math.round((checked / items.length) * 100) };
  };

  const totalProgress = useMemo(() => {
    const allItems = Object.values(checklist).flatMap(c => c.items);
    const checked = allItems.filter(i => i.checked).length;
    return { checked, total: allItems.length, percent: Math.round((checked / allItems.length) * 100) };
  }, [checklist]);

  const addCondition = () => {
    if (!newCondition.name.trim()) return;
    const condition = { ...newCondition, id: Date.now() };
    setConditions(prev => [...prev, condition]);
    setRatings(prev => [...prev, { id: condition.id, name: condition.name, rating: condition.estimatedRating }]);
    setNewCondition({
      name: '', category: 'physical', evidence: '', dbqAvailable: false,
      nexusNeeded: false, inServiceProof: '', severity: 'moderate', estimatedRating: 30, notes: ''
    });
    setShowConditionForm(false);
  };

  const updateCondition = () => {
    if (!editingCondition) return;
    setConditions(prev => prev.map(c => c.id === editingCondition.id ? editingCondition : c));
    setRatings(prev => prev.map(r => r.id === editingCondition.id ? { ...r, name: editingCondition.name, rating: editingCondition.estimatedRating } : r));
    setEditingCondition(null);
  };

  const deleteCondition = (id) => {
    setConditions(prev => prev.filter(c => c.id !== id));
    setRatings(prev => prev.filter(r => r.id !== id));
  };

  const updateRating = (id, newRating) => {
    setRatings(prev => prev.map(r => r.id === id ? { ...r, rating: parseInt(newRating) } : r));
  };

  // Analyze medical history to suggest condition groups
  const analyzeHistoryPatterns = async () => {
    if (!medicalEntries.length) return [];
    
    setAnalyzingHistory(true);
    try {
      const apiKey = localStorage.getItem('openai-api-key');
      if (!apiKey) {
        alert('Please configure your OpenAI API key in Medical History settings');
        setAnalyzingHistory(false);
        return [];
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          temperature: 0.3,
          messages: [
            {
              role: 'system',
              content: `You are a VA disability claims specialist. Analyze medical history entries and group related conditions for VA disability claims. Return ONLY valid JSON array:
[{
  "groupName": "condition name",
  "category": "physical|mental|hearing|etc",
  "entryIds": [array of entry IDs],
  "confidence": "high|medium|low",
  "reasoning": "why these are grouped"
}]

Group entries by:
- Same body system/diagnosis
- Related symptoms (e.g., back pain → leg numbness)
- Chronic patterns (recurring over time)
- Secondary connections

Return empty array [] if no clear patterns.`
            },
            {
              role: 'user',
              content: `Analyze these medical entries and suggest condition groupings:\n\n${JSON.stringify(medicalEntries.map(e => ({
                id: e.id,
                date: e.date,
                issue: e.issue,
                diagnosis: e.diagnosis,
                treatment: e.treatment,
                severity: e.severity,
                bodySystem: e.bodySystem
              })), null, 2)}`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze history');
      }

      const data = await response.json();
      const content = data.choices[0].message.content.trim();
      const jsonText = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const groups = JSON.parse(jsonText);
      
      setSuggestedGroups(groups);
      return groups;
    } catch (error) {
      console.error('Analysis error:', error);
      alert(`Failed to analyze history: ${error.message}`);
      return [];
    } finally {
      setAnalyzingHistory(false);
    }
  };

  // Generate condition from selected medical entries using AI
  const generateConditionFromHistory = async (entries) => {
    if (!entries.length) return null;
    
    setGeneratingCondition(true);
    try {
      const apiKey = localStorage.getItem('openai-api-key');
      if (!apiKey) {
        alert('Please configure your OpenAI API key');
        setGeneratingCondition(false);
        return null;
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          temperature: 0.3,
          max_tokens: 2000,
          messages: [
            {
              role: 'system',
              content: `You are a VA disability claims expert. Generate a comprehensive VA claim condition from medical history entries. Return ONLY valid JSON:
{
  "name": "VA-appropriate condition name",
  "category": "physical|chronic|mental|hearing|sleep|tbi|presumptive|secondary",
  "severity": "mild|moderate|severe|total",
  "estimatedRating": number (0-100, in 10% increments),
  "evidence": "chronological summary of all medical entries with dates and findings",
  "inServiceProof": "specific dates, document sources, LOD references",
  "notes": "pattern analysis, gaps, secondary connections, claim strategy",
  "dbqAvailable": boolean,
  "nexusNeeded": boolean,
  "ratingJustification": "why this rating based on VA Schedule",
  "missingDocs": ["list of needed documents"],
  "claimStrength": "strong|moderate|weak"
}

Base rating on:
- Frequency of treatment
- Severity progression
- Duty impact
- Treatment intensity
- VA Schedule for Rating Disabilities
- Chronicity

Be specific with evidence and cite dates.`
            },
            {
              role: 'user',
              content: `Generate a VA disability condition from these related medical entries:\n\n${JSON.stringify(entries, null, 2)}`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate condition');
      }

      const data = await response.json();
      const content = data.choices[0].message.content.trim();
      const jsonText = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const generated = JSON.parse(jsonText);
      
      setGeneratedCondition(generated);
      return generated;
    } catch (error) {
      console.error('Generation error:', error);
      alert(`Failed to generate condition: ${error.message}`);
      return null;
    } finally {
      setGeneratingCondition(false);
    }
  };

  // Save generated condition
  const saveGeneratedCondition = () => {
    if (!generatedCondition) return;
    
    const condition = { ...generatedCondition, id: Date.now() };
    setConditions(prev => [...prev, condition]);
    setRatings(prev => [...prev, { id: condition.id, name: condition.name, rating: condition.estimatedRating }]);
    setGeneratedCondition(null);
    setShowGenerator(false);
    setSuggestedGroups([]);
    setSelectedEntries([]);
    alert('Condition saved successfully!');
  };

  const combinedRating = useMemo(() => calculateVARating(ratings.map(r => r.rating)), [ratings]);
  const monthlyPayment = getMonthlyPayment(combinedRating);

  const readinessScore = useMemo(() => {
    const checklistScore = totalProgress.percent;
    const conditionsWithEvidence = conditions.filter(c => c.evidence.trim()).length;
    const conditionsWithDBQ = conditions.filter(c => c.dbqAvailable).length;
    const conditionsWithProof = conditions.filter(c => c.inServiceProof.trim()).length;
    const totalConditions = conditions.length || 1;
    
    const evidenceScore = (conditionsWithEvidence / totalConditions) * 100;
    const dbqScore = (conditionsWithDBQ / totalConditions) * 100;
    const proofScore = (conditionsWithProof / totalConditions) * 100;
    
    const conditionSupport = Math.round((evidenceScore + dbqScore + proofScore) / 3);
    const overall = Math.round((checklistScore * 0.4) + (conditionSupport * 0.6));
    
    const weakAreas = [];
    if (checklistScore < 50) weakAreas.push('Checklist completion below 50%');
    if (evidenceScore < 50) weakAreas.push('Evidence documentation incomplete');
    if (dbqScore < 50) weakAreas.push('DBQs not obtained for many conditions');
    if (proofScore < 50) weakAreas.push('In-service proof lacking');
    conditions.forEach(c => {
      if (c.nexusNeeded && !c.evidence.toLowerCase().includes('nexus')) {
        weakAreas.push(`${c.name}: Nexus letter needed but not documented`);
      }
    });
    
    return { overall, checklistScore, conditionSupport, evidenceScore, dbqScore, proofScore, weakAreas };
  }, [totalProgress, conditions]);

  const tabs = [
    { id: 'checklist', label: 'Master Checklist', icon: ClipboardList },
    { id: 'conditions', label: 'Conditions', icon: FileText },
    { id: 'medical-history', label: 'Medical History', icon: Activity },
    { id: 'sha-dbq', label: 'SHA DBQ', icon: FilePlus2 },
    { id: 'calculator', label: 'VA Math', icon: Calculator },
    { id: 'documents', label: 'Document Reqs', icon: Shield },
    { id: 'readiness', label: 'Readiness', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-4 md:p-6" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 glow">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight">
                <span className="text-amber-500">VA</span> RETIREMENT & DISABILITY
                <span className="text-slate-500 text-lg ml-2">PREP SYSTEM</span>
              </h1>
              {isPremium && (
                <span className="px-2 py-1 bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-400 text-xs font-bold rounded border border-amber-500/30">
                  <Crown className="w-3 h-3 inline mr-1" />
                  PREMIUM
                </span>
              )}
            </div>
            <p className="text-slate-400 text-sm mt-1">
              {user ? `Welcome, ${user.email}` : 'Comprehensive planning & tracking dashboard'}
            </p>
            <div className="mt-3">
              <input
                type="text"
                value={veteranName}
                onChange={(e) => setVeteranName(e.target.value)}
                placeholder="Your name (optional - for PDF filename)"
                className="w-full max-w-xs px-3 py-1.5 text-sm bg-slate-900/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Auth & Upgrade buttons */}
            <div className="flex flex-col gap-2">
              {!isPremium && user && (
                <button
                  onClick={handleUpgrade}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 rounded-lg transition-all text-sm font-bold shadow-lg shadow-amber-500/20"
                >
                  <Crown className="w-4 h-4" />
                  <span>Upgrade $19/mo</span>
                </button>
              )}
              {user && (
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  if (canExportPDF) {
                    generatePDFReport();
                  } else {
                    setShowUpgradeModal(true);
                  }
                }}
                className={`flex items-center gap-2 px-3 py-1.5 ${canExportPDF ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border-amber-500/30' : 'bg-slate-700/50 text-slate-500 border-slate-600 cursor-not-allowed'} border rounded-lg transition-colors text-sm font-semibold`}
                title={canExportPDF ? 'Generate PDF report for VSO' : 'Premium feature - Upgrade to unlock'}
              >
                <FileDown className="w-4 h-4" />
                <span>PDF Report</span>
                {!canExportPDF && <Lock className="w-3 h-3" />}
              </button>
              <button
                onClick={() => {
                  if (canExportData) {
                    exportData();
                  } else {
                    setShowUpgradeModal(true);
                  }
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-500/30 rounded-lg transition-colors text-sm"
                title="Export data as backup"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <label className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-lg transition-colors text-sm cursor-pointer" title="Import data from backup">
                <Upload className="w-4 h-4" />
                <span>Import</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 uppercase tracking-wider">Overall Progress</div>
              <div className="text-2xl font-bold text-amber-500">{totalProgress.percent}%</div>
            </div>
            <div className="w-24 h-24 relative">
              <svg className="transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(100,116,139,0.3)" strokeWidth="3"/>
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#f59e0b" strokeWidth="3"
                  strokeDasharray={`${totalProgress.percent} 100`} strokeLinecap="round"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold">{totalProgress.checked}/{totalProgress.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-wrap gap-2 p-2 bg-slate-800/30 rounded-xl border border-slate-700/30">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                activeTab === tab.id 
                  ? 'tab-active text-amber-400 border' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30 border border-transparent'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        
        {/* MASTER CHECKLIST TAB */}
        {activeTab === 'checklist' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              {Object.entries(checklist).map(([key, cat]) => {
                const prog = getCategoryProgress(key);
                return (
                  <div key={key} className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/30">
                    <div className="text-xs text-slate-500 uppercase tracking-wider truncate">{cat.title}</div>
                    <div className="text-xl font-bold text-slate-200 mt-1">{prog.percent}%</div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
                      <div className="h-full progress-bar rounded-full transition-all" style={{ width: `${prog.percent}%` }}/>
                    </div>
                  </div>
                );
              })}
            </div>

            {Object.entries(checklist).map(([key, category]) => {
              const prog = getCategoryProgress(key);
              return (
                <CollapsibleSection 
                  key={key} 
                  title={category.title} 
                  icon={ClipboardList}
                  badge={`${prog.checked}/${prog.total}`}
                  badgeColor={prog.percent === 100 ? 'emerald' : prog.percent > 50 ? 'amber' : 'red'}
                  defaultOpen={key === 'retirement'}
                >
                  <div className="space-y-1 mt-3">
                    {category.items.map(item => (
                      <CheckItem
                        key={item.id}
                        label={item.label}
                        sublabel={item.sublabel}
                        checked={item.checked}
                        onChange={() => handleChecklistChange(key, item.id)}
                      />
                    ))}
                  </div>
                </CollapsibleSection>
              );
            })}
          </div>
        )}

        {/* CONDITIONS TAB */}
        {activeTab === 'conditions' && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="text-lg font-semibold font-display">Condition & Item Tracking</h2>
                    <p className="text-sm text-slate-400">Add conditions, symptoms, diagnoses, and documentation</p>
                  </div>
                  {autoSuggestionsCount > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-600/20 to-emerald-500/20 border border-emerald-500/30 rounded-full animate-pulse">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-300">
                        {autoSuggestionsCount} potential condition{autoSuggestionsCount > 1 ? 's' : ''} detected
                      </span>
                    </div>
                  )}
                </div>
                {medicalEntries.length > 0 && (
                  <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    {medicalEntries.length} medical entries available for analysis
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {medicalEntries.length > 0 && (
                  <button
                    onClick={() => {
                      if (canUseAI) {
                        setShowGenerator(true);
                      } else {
                        setShowUpgradeModal(true);
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 ${canUseAI ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white' : 'bg-slate-700 text-slate-400'} font-semibold rounded-lg transition-all`}
                  >
                    <Sparkles className="w-4 h-4" />
                    Generate from History
                    {!canUseAI && <Lock className="w-3 h-3" />}
                  </button>
                )}
                <button
                  onClick={() => setShowConditionForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Manually
                </button>
              </div>
            </div>

            {/* Condition Form Modal */}
            {(showConditionForm || editingCondition) && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold font-display">
                      {editingCondition ? 'Edit Entry' : 'Add New Entry'}
                    </h3>
                    <button onClick={() => { setShowConditionForm(false); setEditingCondition(null); }} className="text-slate-400 hover:text-slate-200">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Condition / Issue Name</label>
                      <input
                        type="text"
                        value={editingCondition ? editingCondition.name : newCondition.name}
                        onChange={e => editingCondition 
                          ? setEditingCondition({...editingCondition, name: e.target.value})
                          : setNewCondition({...newCondition, name: e.target.value})
                        }
                        placeholder="e.g., Lumbar Strain, PTSD, Tinnitus..."
                        className="w-full px-3 py-2 rounded-lg text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Category</label>
                      <select
                        value={editingCondition ? editingCondition.category : newCondition.category}
                        onChange={e => editingCondition
                          ? setEditingCondition({...editingCondition, category: e.target.value})
                          : setNewCondition({...newCondition, category: e.target.value})
                        }
                        className="w-full px-3 py-2 rounded-lg text-sm"
                      >
                        <option value="physical">Physical Injury</option>
                        <option value="chronic">Chronic Pain</option>
                        <option value="mental">Mental Health</option>
                        <option value="hearing">Hearing/Tinnitus</option>
                        <option value="sleep">Sleep Disorder</option>
                        <option value="tbi">TBI</option>
                        <option value="presumptive">Presumptive</option>
                        <option value="secondary">Secondary</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Current Severity</label>
                      <select
                        value={editingCondition ? editingCondition.severity : newCondition.severity}
                        onChange={e => editingCondition
                          ? setEditingCondition({...editingCondition, severity: e.target.value})
                          : setNewCondition({...newCondition, severity: e.target.value})
                        }
                        className="w-full px-3 py-2 rounded-lg text-sm"
                      >
                        <option value="mild">Mild</option>
                        <option value="moderate">Moderate</option>
                        <option value="severe">Severe</option>
                        <option value="total">Total/Unemployable</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Estimated VA Rating</label>
                      <select
                        value={editingCondition ? editingCondition.estimatedRating : newCondition.estimatedRating}
                        onChange={e => editingCondition
                          ? setEditingCondition({...editingCondition, estimatedRating: parseInt(e.target.value)})
                          : setNewCondition({...newCondition, estimatedRating: parseInt(e.target.value)})
                        }
                        className="w-full px-3 py-2 rounded-lg text-sm"
                      >
                        {[0,10,20,30,40,50,60,70,80,90,100].map(r => (
                          <option key={r} value={r}>{r}%</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingCondition ? editingCondition.dbqAvailable : newCondition.dbqAvailable}
                          onChange={e => editingCondition
                            ? setEditingCondition({...editingCondition, dbqAvailable: e.target.checked})
                            : setNewCondition({...newCondition, dbqAvailable: e.target.checked})
                          }
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm">DBQ Available</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingCondition ? editingCondition.nexusNeeded : newCondition.nexusNeeded}
                          onChange={e => editingCondition
                            ? setEditingCondition({...editingCondition, nexusNeeded: e.target.checked})
                            : setNewCondition({...newCondition, nexusNeeded: e.target.checked})
                          }
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm">Nexus Letter Needed</span>
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Evidence / Documentation</label>
                      <textarea
                        value={editingCondition ? editingCondition.evidence : newCondition.evidence}
                        onChange={e => editingCondition
                          ? setEditingCondition({...editingCondition, evidence: e.target.value})
                          : setNewCondition({...newCondition, evidence: e.target.value})
                        }
                        placeholder="List all evidence: STR entries, DBQs, nexus letters, buddy statements, imaging..."
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">In-Service Proof</label>
                      <textarea
                        value={editingCondition ? editingCondition.inServiceProof : newCondition.inServiceProof}
                        onChange={e => editingCondition
                          ? setEditingCondition({...editingCondition, inServiceProof: e.target.value})
                          : setNewCondition({...newCondition, inServiceProof: e.target.value})
                        }
                        placeholder="LOD, incident report, deployment records, sick call records, etc."
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Notes</label>
                      <textarea
                        value={editingCondition ? editingCondition.notes : newCondition.notes}
                        onChange={e => editingCondition
                          ? setEditingCondition({...editingCondition, notes: e.target.value})
                          : setNewCondition({...newCondition, notes: e.target.value})
                        }
                        placeholder="Additional notes, secondary connection, aggravation factors..."
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => { setShowConditionForm(false); setEditingCondition(null); }}
                      className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={editingCondition ? updateCondition : addCondition}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      {editingCondition ? 'Update Entry' : 'Save Entry'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Conditions List */}
            {conditions.length === 0 ? (
              <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No conditions tracked yet</p>
                <p className="text-sm text-slate-500">Click "Add Entry" to start building your claim</p>
              </div>
            ) : (
              <div className="space-y-3">
                {conditions.map(condition => (
                  <div key={condition.id} className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{documentRequirements[condition.category]?.icon || '📄'}</span>
                          <div>
                            <h4 className="font-semibold text-slate-100">{condition.name}</h4>
                            <p className="text-xs text-slate-500 uppercase tracking-wider">
                              {documentRequirements[condition.category]?.title || condition.category}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                          <div className="p-2 bg-slate-900/50 rounded-lg">
                            <div className="text-xs text-slate-500">Est. Rating</div>
                            <div className="text-lg font-bold text-amber-500">{condition.estimatedRating}%</div>
                          </div>
                          <div className="p-2 bg-slate-900/50 rounded-lg">
                            <div className="text-xs text-slate-500">Severity</div>
                            <div className="text-sm font-semibold capitalize text-slate-200">{condition.severity}</div>
                          </div>
                          <div className="p-2 bg-slate-900/50 rounded-lg">
                            <div className="text-xs text-slate-500">DBQ</div>
                            <div className={`text-sm font-semibold ${condition.dbqAvailable ? 'text-emerald-400' : 'text-red-400'}`}>
                              {condition.dbqAvailable ? '✓ Available' : '✗ Needed'}
                            </div>
                          </div>
                          <div className="p-2 bg-slate-900/50 rounded-lg">
                            <div className="text-xs text-slate-500">Nexus</div>
                            <div className={`text-sm font-semibold ${condition.nexusNeeded ? 'text-amber-400' : 'text-slate-400'}`}>
                              {condition.nexusNeeded ? '⚠ Required' : 'Not needed'}
                            </div>
                          </div>
                        </div>

                        {condition.evidence && (
                          <div className="mt-3 p-3 bg-slate-900/30 rounded-lg">
                            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Evidence</div>
                            <p className="text-sm text-slate-300">{condition.evidence}</p>
                          </div>
                        )}

                        {condition.inServiceProof && (
                          <div className="mt-2 p-3 bg-slate-900/30 rounded-lg">
                            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">In-Service Proof</div>
                            <p className="text-sm text-slate-300">{condition.inServiceProof}</p>
                          </div>
                        )}

                        {condition.nexusNeeded && !condition.evidence.toLowerCase().includes('nexus') && (
                          <div className="mt-3 flex items-center gap-2 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                            <span className="text-sm text-amber-400">Nexus letter marked as needed but not documented in evidence</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => setEditingCondition(condition)}
                          className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCondition(condition.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MEDICAL HISTORY TAB */}
        {activeTab === 'medical-history' && (
          <MedicalHistorySystem
            entries={medicalEntries}
            setEntries={setMedicalEntries}
          />
        )}

        {/* SHA DBQ TAB */}
        {activeTab === 'sha-dbq' && (
          <ShaDbqTab
            shaDbqData={shaDbqData}
            setShaDbqData={setShaDbqData}
            medicalEntries={medicalEntries}
            conditions={conditions}
            veteranName={veteranName}
            isPremium={isPremium}
          />
        )}

        {/* VA MATH CALCULATOR TAB */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calculator Panel */}
              <div className="p-6 bg-slate-800/40 rounded-xl border border-slate-700/30">
                <h2 className="text-lg font-semibold font-display mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-amber-500" />
                  VA Combined Rating Calculator
                </h2>
                
                <div className="space-y-3 mb-6">
                  {ratings.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <p>Add conditions in the Conditions tab to calculate combined rating</p>
                    </div>
                  ) : (
                    ratings.map((r, idx) => (
                      <div key={r.id} className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                        <span className="text-xs text-slate-500 w-6">#{idx + 1}</span>
                        <span className="flex-1 text-sm text-slate-200 truncate">{r.name}</span>
                        <select
                          value={r.rating}
                          onChange={e => updateRating(r.id, e.target.value)}
                          className="w-24 px-2 py-1 rounded text-sm text-center"
                        >
                          {[0,10,20,30,40,50,60,70,80,90,100].map(val => (
                            <option key={val} value={val}>{val}%</option>
                          ))}
                        </select>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-4 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl border border-amber-500/30">
                  <div className="text-xs text-amber-400 uppercase tracking-wider mb-1">Combined VA Rating</div>
                  <div className="text-5xl font-bold text-amber-500">{combinedRating}%</div>
                  <div className="text-sm text-slate-400 mt-1">{ratingDescriptions[combinedRating]}</div>
                </div>
              </div>

              {/* Results Panel */}
              <div className="space-y-4">
                <div className="p-6 bg-slate-800/40 rounded-xl border border-slate-700/30">
                  <h3 className="text-sm text-slate-400 uppercase tracking-wider mb-3">Estimated Monthly Compensation</h3>
                  <div className="text-4xl font-bold text-emerald-400">${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  <p className="text-xs text-slate-500 mt-2">*2024 rates, single veteran, no dependents. Actual amount varies.</p>
                </div>

                <div className="p-6 bg-slate-800/40 rounded-xl border border-slate-700/30">
                  <h3 className="text-sm text-slate-400 uppercase tracking-wider mb-4">Rating Thresholds & Benefits</h3>
                  <div className="space-y-3">
                    {[
                      { rating: 50, label: '50%+', benefits: 'Dependents added to compensation' },
                      { rating: 70, label: '70%+', benefits: 'Vocational Rehab priority, higher comp' },
                      { rating: 100, label: '100%', benefits: 'CHAMPVA for dependents, max benefits' },
                    ].map(tier => (
                      <div key={tier.rating} className={`p-3 rounded-lg border ${
                        combinedRating >= tier.rating 
                          ? 'bg-emerald-500/10 border-emerald-500/30' 
                          : 'bg-slate-900/30 border-slate-700/30'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className={`font-bold ${combinedRating >= tier.rating ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {tier.label}
                          </span>
                          {combinedRating >= tier.rating && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{tier.benefits}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-400">
                      <strong className="text-sky-400">VA Math Formula:</strong> Ratings are applied to remaining "whole person" percentage, not added. 
                      Example: 50% + 30% = 50 + (30% of remaining 50%) = 50 + 15 = 65% → rounds to 70%.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            {ratings.length > 1 && (
              <div className="p-6 bg-slate-800/40 rounded-xl border border-slate-700/30">
                <h3 className="text-sm text-slate-400 uppercase tracking-wider mb-4">Calculation Breakdown</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-2 text-slate-500">Step</th>
                        <th className="text-left py-2 text-slate-500">Condition</th>
                        <th className="text-right py-2 text-slate-500">Rating</th>
                        <th className="text-right py-2 text-slate-500">Applied To</th>
                        <th className="text-right py-2 text-slate-500">Value Added</th>
                        <th className="text-right py-2 text-slate-500">Running Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const sorted = [...ratings].sort((a, b) => b.rating - a.rating);
                        let remaining = 100;
                        let runningTotal = 0;
                        return sorted.map((r, idx) => {
                          const appliedTo = remaining;
                          const valueAdded = (r.rating / 100) * remaining;
                          runningTotal += valueAdded;
                          remaining = remaining - valueAdded;
                          return (
                            <tr key={r.id} className="border-b border-slate-700/50">
                              <td className="py-2 text-slate-400">{idx + 1}</td>
                              <td className="py-2 text-slate-200">{r.name}</td>
                              <td className="py-2 text-right text-amber-400">{r.rating}%</td>
                              <td className="py-2 text-right text-slate-400">{appliedTo.toFixed(1)}%</td>
                              <td className="py-2 text-right text-emerald-400">+{valueAdded.toFixed(1)}%</td>
                              <td className="py-2 text-right text-slate-200 font-semibold">{runningTotal.toFixed(1)}%</td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={5} className="py-3 text-right text-slate-400">Rounded Combined Rating:</td>
                        <td className="py-3 text-right text-2xl font-bold text-amber-500">{combinedRating}%</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DOCUMENT REQUIREMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
              <h2 className="text-lg font-semibold font-display">Document Requirements by Condition Category</h2>
              <p className="text-sm text-slate-400 mt-1">Complete evidence checklist for each type of claim</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Object.entries(documentRequirements).map(([key, category]) => (
                <CollapsibleSection key={key} title={`${category.icon} ${category.title}`} icon={FileText}>
                  <div className="space-y-2 mt-3">
                    {category.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 py-2 px-3 bg-slate-900/30 rounded-lg">
                        <span className="text-amber-500 mt-0.5">▸</span>
                        <span className="text-sm text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>
              ))}
            </div>

            {/* General Document Checklists */}
            <div className="mt-6 p-6 bg-slate-800/40 rounded-xl border border-slate-700/30">
              <h3 className="text-lg font-semibold font-display mb-4">📁 General Document Checklists</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-900/40 rounded-lg">
                  <h4 className="font-semibold text-amber-400 mb-3">Service Treatment Records</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>▸ Entrance physical</li>
                    <li>▸ Separation physical</li>
                    <li>▸ Sick call records</li>
                    <li>▸ Periodic health assessments</li>
                    <li>▸ Immunization records</li>
                    <li>▸ Dental records</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-slate-900/40 rounded-lg">
                  <h4 className="font-semibold text-amber-400 mb-3">Incident Documentation</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>▸ Line of Duty (LOD) reports</li>
                    <li>▸ Accident reports</li>
                    <li>▸ Safety incident reports</li>
                    <li>▸ Witness statements</li>
                    <li>▸ Commander narratives</li>
                    <li>▸ Police/MP reports</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-slate-900/40 rounded-lg">
                  <h4 className="font-semibold text-amber-400 mb-3">Medical Records</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>▸ Surgery reports</li>
                    <li>▸ Hospitalization records</li>
                    <li>▸ Physical therapy notes</li>
                    <li>▸ Specialist consultations</li>
                    <li>▸ Lab results</li>
                    <li>▸ Imaging studies</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-slate-900/40 rounded-lg">
                  <h4 className="font-semibold text-amber-400 mb-3">Supporting Evidence</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>▸ Buddy/lay statements</li>
                    <li>▸ Personal statements</li>
                    <li>▸ Deployment orders</li>
                    <li>▸ Performance reports</li>
                    <li>▸ Award citations</li>
                    <li>▸ MOS documentation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* READINESS TAB */}
        {activeTab === 'readiness' && (
          <div className="space-y-6">
            {/* Main Score */}
            <div className="p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl border border-slate-700/30 glow">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="text-xl font-semibold font-display">Submission Readiness Score</h2>
                  <p className="text-sm text-slate-400 mt-1">Based on checklist completion and condition documentation</p>
                </div>
                <div className="relative w-40 h-40">
                  <svg className="transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(100,116,139,0.3)" strokeWidth="3"/>
                    <circle cx="18" cy="18" r="15.5" fill="none" 
                      stroke={readinessScore.overall >= 80 ? '#10b981' : readinessScore.overall >= 50 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="3" strokeDasharray={`${readinessScore.overall} 100`} strokeLinecap="round"/>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">{readinessScore.overall}%</span>
                    <span className="text-xs text-slate-500 uppercase">Ready</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Checklist Progress', value: readinessScore.checklistScore, icon: ClipboardList },
                { label: 'Evidence Documented', value: Math.round(readinessScore.evidenceScore), icon: FileText },
                { label: 'DBQs Obtained', value: Math.round(readinessScore.dbqScore), icon: Shield },
                { label: 'In-Service Proof', value: Math.round(readinessScore.proofScore), icon: Target },
              ].map(metric => (
                <div key={metric.label} className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-3">
                    <metric.icon className="w-4 h-4 text-amber-500" />
                    <span className="text-xs text-slate-500 uppercase tracking-wider">{metric.label}</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-100">{metric.value}%</div>
                  <div className="w-full h-2 bg-slate-700 rounded-full mt-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        metric.value >= 80 ? 'bg-emerald-500' : metric.value >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Weak Areas */}
            {readinessScore.weakAreas.length > 0 && (
              <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-xl">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-red-400 mb-4">
                  <AlertTriangle className="w-5 h-5" />
                  Areas Requiring Attention
                </h3>
                <div className="space-y-2">
                  {readinessScore.weakAreas.map((area, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-300">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30 text-center">
                <div className="text-3xl font-bold text-amber-500">{conditions.length}</div>
                <div className="text-xs text-slate-500 uppercase mt-1">Conditions Tracked</div>
              </div>
              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30 text-center">
                <div className="text-3xl font-bold text-emerald-400">{conditions.filter(c => c.dbqAvailable).length}</div>
                <div className="text-xs text-slate-500 uppercase mt-1">DBQs Obtained</div>
              </div>
              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30 text-center">
                <div className="text-3xl font-bold text-sky-400">{combinedRating}%</div>
                <div className="text-xs text-slate-500 uppercase mt-1">Est. Combined Rating</div>
              </div>
              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30 text-center">
                <div className="text-3xl font-bold text-purple-400">${monthlyPayment.toFixed(0)}</div>
                <div className="text-xs text-slate-500 uppercase mt-1">Est. Monthly Comp</div>
              </div>
            </div>

            {/* Action Recommendations */}
            <div className="p-6 bg-slate-800/40 rounded-xl border border-slate-700/30">
              <h3 className="text-lg font-semibold font-display mb-4">📋 Next Steps</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {conditions.filter(c => !c.dbqAvailable).length > 0 && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <h4 className="font-semibold text-amber-400">Obtain Missing DBQs</h4>
                    <p className="text-sm text-slate-400 mt-1">
                      {conditions.filter(c => !c.dbqAvailable).length} condition(s) need DBQs: {' '}
                      {conditions.filter(c => !c.dbqAvailable).map(c => c.name).join(', ')}
                    </p>
                  </div>
                )}
                {conditions.filter(c => c.nexusNeeded).length > 0 && (
                  <div className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-lg">
                    <h4 className="font-semibold text-sky-400">Secure Nexus Letters</h4>
                    <p className="text-sm text-slate-400 mt-1">
                      {conditions.filter(c => c.nexusNeeded).length} condition(s) require nexus letters: {' '}
                      {conditions.filter(c => c.nexusNeeded).map(c => c.name).join(', ')}
                    </p>
                  </div>
                )}
                {totalProgress.percent < 100 && (
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <h4 className="font-semibold text-purple-400">Complete Checklist Items</h4>
                    <p className="text-sm text-slate-400 mt-1">
                      {totalProgress.total - totalProgress.checked} items remaining on your master checklist
                    </p>
                  </div>
                )}
                {conditions.filter(c => !c.evidence.trim()).length > 0 && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <h4 className="font-semibold text-red-400">Document Evidence</h4>
                    <p className="text-sm text-slate-400 mt-1">
                      {conditions.filter(c => !c.evidence.trim()).length} condition(s) have no evidence documented
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Condition Generator Modal */}
      {showGenerator && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-6xl max-h-[90vh] flex flex-col my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-700">
              <h3 className="text-lg font-semibold font-display flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                Generate Condition from Medical History
              </h3>
              <button onClick={() => { setShowGenerator(false); setSuggestedGroups([]); setSelectedEntries([]); setGeneratedCondition(null); }} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 flex-1 overflow-y-auto">
              {!generatedCondition ? (
                <>
                  {suggestedGroups.length === 0 ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <p className="text-sm text-emerald-400">
                          AI will analyze your {medicalEntries.length} medical entries to identify patterns and suggest related condition groupings.
                        </p>
                      </div>

                      <button
                        onClick={analyzeHistoryPatterns}
                        disabled={analyzingHistory}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg disabled:opacity-50"
                      >
                        {analyzingHistory ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Analyzing Medical History...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            Analyze & Suggest Conditions
                          </>
                        )}
                      </button>

                      <div className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-lg">
                        <p className="text-xs text-sky-400">
                          <strong>AI will identify:</strong> Related symptoms, chronic patterns, recurring issues, body system groupings, and secondary connections
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <p className="text-sm text-emerald-400 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Found {suggestedGroups.length} potential condition(s). Select entries to generate a claim-ready condition.
                        </p>
                      </div>

                      {suggestedGroups.map((group, idx) => {
                        const groupEntries = medicalEntries.filter(e => group.entryIds.includes(e.id));
                        return (
                          <div key={idx} className={`p-4 rounded-xl border ${
                            group.confidence === 'high' ? 'bg-emerald-500/10 border-emerald-500/30' :
                            group.confidence === 'medium' ? 'bg-amber-500/10 border-amber-500/30' :
                            'bg-slate-700/30 border-slate-600'
                          }`}>
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-lg text-slate-100">{group.groupName}</h4>
                                <p className="text-xs text-slate-400 mt-1">{group.reasoning}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded ${
                                  group.confidence === 'high' ? 'bg-emerald-500/20 text-emerald-400' :
                                  group.confidence === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                                  'bg-slate-500/20 text-slate-400'
                                }`}>
                                  {group.confidence} confidence
                                </span>
                                <button
                                  onClick={async () => {
                                    setSelectedEntries(groupEntries);
                                    await generateConditionFromHistory(groupEntries);
                                  }}
                                  disabled={generatingCondition}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg disabled:opacity-50"
                                >
                                  {generatingCondition ? 'Generating...' : 'Generate Condition'}
                                </button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <p className="text-xs text-slate-500 font-semibold uppercase">Related Medical Entries ({groupEntries.length}):</p>
                              {groupEntries.map(entry => (
                                <div key={entry.id} className="p-2 bg-slate-900/50 rounded text-xs">
                                  <span className="text-slate-500">{entry.date}</span> • <span className="text-slate-200">{entry.issue}</span>
                                  {entry.diagnosis && <span className="text-emerald-400"> → {entry.diagnosis}</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Condition generated successfully! Review and edit before saving.
                      </p>
                      {generatedCondition.claimStrength && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          generatedCondition.claimStrength === 'strong' ? 'bg-emerald-500/20 text-emerald-400' :
                          generatedCondition.claimStrength === 'moderate' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {generatedCondition.claimStrength} claim
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Condition Name</label>
                      <input
                        type="text"
                        value={generatedCondition.name || ''}
                        onChange={e => setGeneratedCondition({...generatedCondition, name: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg text-sm bg-slate-900/80 border border-slate-600 text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Category</label>
                      <select
                        value={generatedCondition.category || 'physical'}
                        onChange={e => setGeneratedCondition({...generatedCondition, category: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg text-sm bg-slate-900/80 border border-slate-600 text-slate-200"
                      >
                        <option value="physical">Physical Injury</option>
                        <option value="chronic">Chronic Pain</option>
                        <option value="mental">Mental Health</option>
                        <option value="hearing">Hearing/Tinnitus</option>
                        <option value="sleep">Sleep Disorder</option>
                        <option value="tbi">TBI</option>
                        <option value="presumptive">Presumptive</option>
                        <option value="secondary">Secondary</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Severity</label>
                      <select
                        value={generatedCondition.severity || 'moderate'}
                        onChange={e => setGeneratedCondition({...generatedCondition, severity: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg text-sm bg-slate-900/80 border border-slate-600 text-slate-200"
                      >
                        <option value="mild">Mild</option>
                        <option value="moderate">Moderate</option>
                        <option value="severe">Severe</option>
                        <option value="total">Total/Unemployable</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Estimated VA Rating</label>
                      <select
                        value={generatedCondition.estimatedRating || 30}
                        onChange={e => setGeneratedCondition({...generatedCondition, estimatedRating: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 rounded-lg text-sm bg-slate-900/80 border border-slate-600 text-slate-200"
                      >
                        {[0,10,20,30,40,50,60,70,80,90,100].map(r => (
                          <option key={r} value={r}>{r}%</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={generatedCondition.dbqAvailable || false}
                          onChange={e => setGeneratedCondition({...generatedCondition, dbqAvailable: e.target.checked})}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-slate-300">DBQ Available</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={generatedCondition.nexusNeeded || false}
                          onChange={e => setGeneratedCondition({...generatedCondition, nexusNeeded: e.target.checked})}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-slate-300">Nexus Letter Needed</span>
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Evidence Summary</label>
                      <textarea
                        value={generatedCondition.evidence || ''}
                        onChange={e => setGeneratedCondition({...generatedCondition, evidence: e.target.value})}
                        rows={6}
                        className="w-full px-3 py-2 rounded-lg text-sm bg-slate-900/80 border border-slate-600 text-slate-200 font-mono"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">In-Service Proof</label>
                      <textarea
                        value={generatedCondition.inServiceProof || ''}
                        onChange={e => setGeneratedCondition({...generatedCondition, inServiceProof: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg text-sm bg-slate-900/80 border border-slate-600 text-slate-200"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Notes & Analysis</label>
                      <textarea
                        value={generatedCondition.notes || ''}
                        onChange={e => setGeneratedCondition({...generatedCondition, notes: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 rounded-lg text-sm bg-slate-900/80 border border-slate-600 text-slate-200"
                      />
                    </div>

                    {generatedCondition.ratingJustification && (
                      <div className="md:col-span-2 p-3 bg-sky-500/10 border border-sky-500/20 rounded-lg">
                        <p className="text-xs text-sky-400 font-semibold mb-1">Rating Justification:</p>
                        <p className="text-xs text-slate-300">{generatedCondition.ratingJustification}</p>
                      </div>
                    )}

                    {generatedCondition.missingDocs && generatedCondition.missingDocs.length > 0 && (
                      <div className="md:col-span-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                        <p className="text-xs text-amber-400 font-semibold mb-2">Missing Documentation:</p>
                        <ul className="space-y-1">
                          {generatedCondition.missingDocs.map((doc, i) => (
                            <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                              <AlertTriangle className="w-3 h-3" />
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-slate-700">
              <button
                onClick={() => { setShowGenerator(false); setSuggestedGroups([]); setSelectedEntries([]); setGeneratedCondition(null); }}
                className="px-4 py-2 text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              {generatedCondition && (
                <button
                  onClick={saveGeneratedCondition}
                  className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Save Condition
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl border border-amber-500/30 p-8 max-w-md w-full">
            <div className="text-center">
              <div className="inline-flex p-4 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-xl mb-4">
                <Crown className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-100 mb-2">Upgrade to Premium</h3>
              <p className="text-slate-400 mb-6">
                Unlock AI-powered features, unlimited entries, and professional PDF exports.
              </p>

              <div className="text-left space-y-3 mb-6">
                {[
                  'AI Document Parsing',
                  'AI Condition Generator',
                  'Unlimited conditions & entries',
                  'PDF Export for VSO',
                  'Data export/import',
                  'Cloud sync (coming soon)',
                  'Priority support'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="text-3xl font-bold text-slate-100 mb-6">
                $19<span className="text-lg text-slate-500 font-normal">/month</span>
              </div>

              <div className="flex flex-col gap-3">
                {isStripeConfigured ? (
                  <button
                    onClick={() => {
                      setShowUpgradeModal(false);
                      handleUpgrade();
                    }}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold rounded-lg transition-all"
                  >
                    Upgrade Now
                  </button>
                ) : (
                  <div className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-lg text-sm text-sky-400">
                    <p className="font-semibold mb-1">Stripe Not Configured</p>
                    <p className="text-xs">Add your Stripe keys to .env to enable payments.</p>
                  </div>
                )}
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-lg transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-8 p-4 text-center text-xs text-slate-600 border-t border-slate-800">
        VA Retirement & Disability Preparation System • Organizational Tool • Not Legal or Medical Advice
      </div>

      {/* VA Claims Chat Assistant */}
      <ChatAgent 
        conditions={conditions} 
        medicalEntries={medicalEntries}
        isPremium={isPremium}
      />
    </div>
  );
}
