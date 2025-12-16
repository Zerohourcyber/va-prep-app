import React, { useState, useMemo } from 'react';
import { 
  Plus, Calendar, FileText, Activity, Brain, Heart, Bone, Eye, Ear, 
  Wind, Moon, Pill, AlertTriangle, CheckCircle2, Clock, Link2, 
  TrendingUp, Search, Filter, X, Edit2, Trash2, ChevronRight, 
  ChevronDown, Flag, Zap, FileWarning, ClipboardList, BarChart3,
  Stethoscope, Shield, Target, ArrowRight, Info, AlertCircle, Settings, 
  Sparkles, Key, Download
} from 'lucide-react';

// Body System Categories
const BODY_SYSTEMS = {
  mental: { name: 'Mental Health', icon: Brain, color: 'violet', keywords: ['anxiety', 'depression', 'ptsd', 'stress', 'insomnia', 'mood', 'psychiatric', 'mental', 'behavioral', 'counseling', 'therapy'] },
  musculoskeletal: { name: 'Musculoskeletal', icon: Bone, color: 'amber', keywords: ['back', 'spine', 'knee', 'shoulder', 'joint', 'muscle', 'pain', 'strain', 'sprain', 'fracture', 'arthritis', 'disc', 'lumbar', 'cervical', 'hip', 'ankle', 'wrist', 'elbow'] },
  respiratory: { name: 'Respiratory', icon: Wind, color: 'sky', keywords: ['breathing', 'asthma', 'sinus', 'apnea', 'copd', 'lung', 'bronchitis', 'pneumonia', 'allergies', 'nasal', 'respiratory', 'shortness of breath'] },
  cardiovascular: { name: 'Cardiovascular', icon: Heart, color: 'red', keywords: ['heart', 'blood pressure', 'hypertension', 'cardiac', 'chest pain', 'cholesterol', 'circulation', 'vascular'] },
  neurological: { name: 'Neurological', icon: Zap, color: 'purple', keywords: ['headache', 'migraine', 'tbi', 'concussion', 'nerve', 'neuropathy', 'seizure', 'vertigo', 'dizziness', 'numbness', 'tingling'] },
  sleep: { name: 'Sleep Disorders', icon: Moon, color: 'indigo', keywords: ['sleep', 'insomnia', 'apnea', 'fatigue', 'cpap', 'tired', 'rest', 'snoring'] },
  digestive: { name: 'Digestive/GI', icon: Activity, color: 'orange', keywords: ['stomach', 'gerd', 'ibs', 'acid reflux', 'nausea', 'bowel', 'digestive', 'gi', 'gastro', 'ulcer', 'hernia'] },
  skin: { name: 'Skin/Dermatology', icon: Shield, color: 'pink', keywords: ['skin', 'rash', 'eczema', 'psoriasis', 'acne', 'dermatitis', 'burn', 'scar'] },
  vision: { name: 'Vision/Eyes', icon: Eye, color: 'emerald', keywords: ['eye', 'vision', 'glasses', 'blind', 'glaucoma', 'cataract', 'optical'] },
  hearing: { name: 'Hearing/ENT', icon: Ear, color: 'teal', keywords: ['hearing', 'ear', 'tinnitus', 'deaf', 'audiogram', 'ent', 'throat', 'sinus'] },
  endocrine: { name: 'Endocrine/Metabolic', icon: Pill, color: 'lime', keywords: ['diabetes', 'thyroid', 'hormone', 'metabolic', 'weight', 'obesity'] },
  genitourinary: { name: 'Genitourinary', icon: Activity, color: 'cyan', keywords: ['kidney', 'bladder', 'urinary', 'prostate', 'reproductive'] },
};

// VA Rating ranges by condition type
const VA_RATING_GUIDANCE = {
  mental: { range: '0-100%', common: '30-70%', note: 'Based on occupational/social impairment' },
  musculoskeletal: { range: '0-100%', common: '10-40%', note: 'Based on ROM limitation, pain, instability' },
  respiratory: { range: '0-100%', common: '10-60%', note: 'Based on PFT results, frequency' },
  sleep: { range: '0-100%', common: '30-50%', note: 'Sleep apnea: 50% with CPAP' },
  hearing: { range: '0-100%', common: '0-10%', note: 'Tinnitus: 10% max; hearing loss by audiogram' },
  tbi: { range: '0-100%', common: '10-70%', note: 'Based on residuals and cognitive impact' },
  skin: { range: '0-60%', common: '10-30%', note: 'Based on % body affected, treatment' },
  cardiovascular: { range: '0-100%', common: '10-60%', note: 'Based on METs, EF, symptoms' },
};

const DOC_SOURCES = [
  'Service Treatment Record (STR)',
  'Clinical Note',
  'Specialist Referral',
  'Profile/Limitation',
  'Memorandum/LOD',
  'Lab Result',
  'Imaging (X-ray/MRI/CT)',
  'Surgery Report',
  'Physical Therapy Note',
  'Mental Health Note',
  'Pharmacy Record',
  'Separation Physical',
  'Entrance Physical',
  'Periodic Health Assessment',
  'Deployment Health Record',
  'Emergency Room Record',
  'Civilian Medical Record',
  'Buddy Statement',
];

const SEVERITY_LEVELS = [
  { value: 'minor', label: 'Minor', color: 'slate' },
  { value: 'moderate', label: 'Moderate', color: 'yellow' },
  { value: 'significant', label: 'Significant', color: 'orange' },
  { value: 'severe', label: 'Severe', color: 'red' },
  { value: 'chronic', label: 'Chronic/Ongoing', color: 'purple' },
];

// Detect body system from text
const detectBodySystem = (text) => {
  const lowerText = text.toLowerCase();
  for (const [key, system] of Object.entries(BODY_SYSTEMS)) {
    if (system.keywords.some(kw => lowerText.includes(kw))) {
      return key;
    }
  }
  return 'other';
};

// Format date for display
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Get year from date
const getYear = (dateStr) => new Date(dateStr).getFullYear();

export default function MedicalHistorySystem({ entries: externalEntries, setEntries: externalSetEntries }) {
  const [activeView, setActiveView] = useState('dashboard');
  const entries = externalEntries || [];
  const setEntries = externalSetEntries || (() => {});
  const [conditionChains, setConditionChains] = useState([]);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [selectedChain, setSelectedChain] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [openAIKey, setOpenAIKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showParser, setShowParser] = useState(false);
  const [documentText, setDocumentText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [newEntry, setNewEntry] = useState({
    date: '', issue: '', diagnosis: '', treatment: '', dutyImpact: '',
    docSource: '', followUp: '', notes: '', severity: 'moderate',
    bodySystem: '', linkedChain: '', isRecurrence: false, hasGap: false
  });

  // Load API key from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('openai-api-key');
    if (saved) setOpenAIKey(saved);
  }, []);

  // Save API key to localStorage
  const saveAPIKey = () => {
    if (openAIKey.trim()) {
      localStorage.setItem('openai-api-key', openAIKey.trim());
      alert('API key saved successfully');
      setShowSettings(false);
    }
  };

  // Parse medical document with OpenAI
  const parseDocument = async () => {
    if (!documentText.trim() || !openAIKey) {
      alert('Please enter document text and configure your OpenAI API key');
      return;
    }

    setParsing(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAIKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0.2,
          messages: [
            {
              role: 'system',
              content: `You are a medical records extraction assistant. Extract information from military medical documents and return ONLY valid JSON with these exact fields:
{
  "date": "YYYY-MM-DD format",
  "issue": "primary complaint or symptom",
  "diagnosis": "formal diagnosis if present",
  "treatment": "treatment, medication, or intervention",
  "dutyImpact": "any duty limitations or impact mentioned",
  "docSource": "type of document (e.g., AHLTA Consultation, Sick Call, ER Visit)",
  "followUp": "follow-up instructions or referrals",
  "notes": "additional relevant context",
  "severity": "minor|moderate|significant|severe|chronic",
  "bodySystem": "auto-detected from symptoms",
  "confidence": "high|medium|low"
}

Rules:
- Use empty string "" if field not found
- Convert any date format to YYYY-MM-DD
- Infer severity from context (pain levels, frequency, impact)
- Detect body system from symptoms/diagnosis
- Return ONLY the JSON object, no markdown or explanation`
            },
            {
              role: 'user',
              content: `Extract medical information from this document:\n\n${documentText}`
            }
          ]
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API error');
      }

      const data = await response.json();
      const content = data.choices[0].message.content.trim();
      
      // Remove markdown code blocks if present
      const jsonText = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(jsonText);
      
      setParsedData(parsed);
    } catch (error) {
      console.error('Parse error:', error);
      alert(`Failed to parse document: ${error.message}`);
    } finally {
      setParsing(false);
    }
  };

  // Save parsed entry
  const saveParsedEntry = () => {
    if (!parsedData) return;
    
    const entry = {
      ...parsedData,
      id: Date.now(),
      bodySystem: parsedData.bodySystem || detectBodySystem(`${parsedData.issue} ${parsedData.diagnosis}`)
    };
    
    setEntries(prev => [...prev, entry]);
    setShowParser(false);
    setDocumentText('');
    setParsedData(null);
    alert('Medical entry saved successfully!');
  };

  // Derived data
  const years = useMemo(() => {
    const uniqueYears = [...new Set(entries.map(e => getYear(e.date)))].sort((a, b) => b - a);
    return uniqueYears;
  }, [entries]);

  const entriesBySystem = useMemo(() => {
    const grouped = {};
    Object.keys(BODY_SYSTEMS).forEach(sys => { grouped[sys] = []; });
    grouped.other = [];
    entries.forEach(entry => {
      const sys = entry.bodySystem || detectBodySystem(`${entry.issue} ${entry.diagnosis}`);
      if (grouped[sys]) grouped[sys].push(entry);
      else grouped.other.push(entry);
    });
    return grouped;
  }, [entries]);

  const entriesByYear = useMemo(() => {
    const grouped = {};
    entries.forEach(entry => {
      const year = getYear(entry.date);
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(entry);
    });
    return grouped;
  }, [entries]);

  const filteredEntries = useMemo(() => {
    let result = [...entries];
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(e => 
        e.issue.toLowerCase().includes(lower) ||
        e.diagnosis.toLowerCase().includes(lower) ||
        e.treatment.toLowerCase().includes(lower) ||
        e.notes.toLowerCase().includes(lower)
      );
    }
    if (filterYear !== 'all') {
      result = result.filter(e => getYear(e.date) === parseInt(filterYear));
    }
    if (selectedSystem) {
      result = result.filter(e => (e.bodySystem || detectBodySystem(`${e.issue} ${e.diagnosis}`)) === selectedSystem);
    }
    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [entries, searchTerm, filterYear, selectedSystem]);

  // Pattern detection
  const patterns = useMemo(() => {
    const detected = [];
    
    // Recurring conditions
    const issueCount = {};
    entries.forEach(e => {
      const key = e.issue.toLowerCase().trim();
      issueCount[key] = (issueCount[key] || 0) + 1;
    });
    Object.entries(issueCount).filter(([, count]) => count >= 3).forEach(([issue, count]) => {
      detected.push({ type: 'recurring', issue, count, severity: 'high' });
    });

    // Escalations (same issue with increasing severity)
    const issuesBySeverity = {};
    const severityOrder = { minor: 1, moderate: 2, significant: 3, severe: 4, chronic: 5 };
    entries.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(e => {
      const key = e.issue.toLowerCase().trim();
      if (!issuesBySeverity[key]) issuesBySeverity[key] = [];
      issuesBySeverity[key].push({ date: e.date, severity: e.severity });
    });
    Object.entries(issuesBySeverity).forEach(([issue, records]) => {
      if (records.length >= 2) {
        const first = severityOrder[records[0].severity] || 2;
        const last = severityOrder[records[records.length - 1].severity] || 2;
        if (last > first) {
          detected.push({ type: 'escalation', issue, from: records[0].severity, to: records[records.length - 1].severity });
        }
      }
    });

    // Gaps (12+ months between related entries)
    Object.entries(issuesBySeverity).forEach(([issue, records]) => {
      for (let i = 1; i < records.length; i++) {
        const gap = (new Date(records[i].date) - new Date(records[i-1].date)) / (1000 * 60 * 60 * 24 * 30);
        if (gap > 12) {
          detected.push({ type: 'gap', issue, months: Math.round(gap), from: records[i-1].date, to: records[i].date });
        }
      }
    });

    return detected;
  }, [entries]);

  // Potential VA claims analysis
  const claimsAnalysis = useMemo(() => {
    const claims = [];
    Object.entries(entriesBySystem).forEach(([system, sysEntries]) => {
      if (sysEntries.length === 0 || system === 'other') return;
      
      const hasMultipleVisits = sysEntries.length >= 2;
      const hasDiagnosis = sysEntries.some(e => e.diagnosis.trim());
      const hasDutyImpact = sysEntries.some(e => e.dutyImpact.trim());
      const hasChronicPattern = sysEntries.some(e => e.severity === 'chronic');
      const hasEscalation = patterns.some(p => p.type === 'escalation' && 
        sysEntries.some(e => e.issue.toLowerCase().includes(p.issue)));
      
      let strength = 0;
      if (hasMultipleVisits) strength += 20;
      if (hasDiagnosis) strength += 25;
      if (hasDutyImpact) strength += 20;
      if (hasChronicPattern) strength += 20;
      if (hasEscalation) strength += 15;
      
      const gaps = patterns.filter(p => p.type === 'gap' && 
        sysEntries.some(e => e.issue.toLowerCase().includes(p.issue)));
      
      claims.push({
        system,
        name: BODY_SYSTEMS[system]?.name || system,
        entryCount: sysEntries.length,
        strength,
        hasMultipleVisits,
        hasDiagnosis,
        hasDutyImpact,
        hasChronicPattern,
        hasEscalation,
        gaps: gaps.length,
        ratingGuidance: VA_RATING_GUIDANCE[system] || { range: '0-100%', common: 'Varies', note: 'See VA Schedule for Rating Disabilities' },
        missingDocs: [],
      });
    });
    
    // Check for missing documentation
    claims.forEach(claim => {
      const sysEntries = entriesBySystem[claim.system];
      const hasSeparationPhysical = sysEntries.some(e => e.docSource.includes('Separation'));
      const hasImaging = sysEntries.some(e => e.docSource.includes('Imaging') || e.docSource.includes('X-ray') || e.docSource.includes('MRI'));
      const hasSpecialist = sysEntries.some(e => e.docSource.includes('Specialist'));
      
      if (!hasSeparationPhysical && sysEntries.length > 0) claim.missingDocs.push('Separation Physical documentation');
      if (['musculoskeletal', 'neurological'].includes(claim.system) && !hasImaging) {
        claim.missingDocs.push('Imaging studies (X-ray/MRI)');
      }
      if (claim.strength >= 50 && !hasSpecialist) {
        claim.missingDocs.push('Specialist referral/evaluation');
      }
    });
    
    return claims.sort((a, b) => b.strength - a.strength);
  }, [entriesBySystem, patterns]);

  // Handlers
  const addEntry = () => {
    if (!newEntry.date || !newEntry.issue) return;
    const entry = {
      ...newEntry,
      id: Date.now(),
      bodySystem: newEntry.bodySystem || detectBodySystem(`${newEntry.issue} ${newEntry.diagnosis}`)
    };
    setEntries(prev => [...prev, entry]);
    resetForm();
  };

  const updateEntry = () => {
    if (!editingEntry) return;
    setEntries(prev => prev.map(e => e.id === editingEntry.id ? editingEntry : e));
    setEditingEntry(null);
    setShowEntryForm(false);
  };

  const deleteEntry = (id) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const resetForm = () => {
    setNewEntry({
      date: '', issue: '', diagnosis: '', treatment: '', dutyImpact: '',
      docSource: '', followUp: '', notes: '', severity: 'moderate',
      bodySystem: '', linkedChain: '', isRecurrence: false, hasGap: false
    });
    setShowEntryForm(false);
    setEditingEntry(null);
  };

  const addConditionChain = (name, description) => {
    setConditionChains(prev => [...prev, { id: Date.now(), name, description, entries: [] }]);
  };

  // Export to CSV
  const exportToCSV = () => {
    if (entries.length === 0) {
      alert('No entries to export');
      return;
    }

    // CSV escape function
    const escapeCSV = (str) => {
      if (!str) return '';
      const escaped = String(str).replace(/"/g, '""');
      return escaped.includes(',') || escaped.includes('"') || escaped.includes('\n') 
        ? `"${escaped}"` 
        : escaped;
    };

    // CSV headers
    const headers = [
      'Item Name',
      'Body System',
      'Due To / Service Connection',
      'Date Began/Worsened',
      'Severity',
      'Documentation Source',
      'Treatment',
      'Follow-up'
    ];

    // Map entries to CSV rows
    const rows = entries.map(entry => {
      const itemName = entry.diagnosis 
        ? `${entry.issue} - ${entry.diagnosis}` 
        : entry.issue;
      
      const bodySystemName = BODY_SYSTEMS[entry.bodySystem]?.name || entry.bodySystem || 'Other';
      
      const serviceConnection = [entry.dutyImpact, entry.notes]
        .filter(Boolean)
        .join(' | ');

      return [
        escapeCSV(itemName),
        escapeCSV(bodySystemName),
        escapeCSV(serviceConnection),
        escapeCSV(formatDate(entry.date)),
        escapeCSV(entry.severity),
        escapeCSV(entry.docSource),
        escapeCSV(entry.treatment),
        escapeCSV(entry.followUp)
      ].join(',');
    });

    // Combine headers and rows
    const csvContent = [headers.join(','), ...rows].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `va-medical-history-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Views
  const views = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'systems', label: 'Body Systems', icon: Activity },
    { id: 'entries', label: 'All Entries', icon: FileText },
    { id: 'patterns', label: 'Patterns', icon: TrendingUp },
    { id: 'claims', label: 'Claims Analysis', icon: Target },
  ];

  const colorClasses = {
    violet: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    sky: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    indigo: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    pink: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    teal: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    lime: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    slate: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100" style={{ fontFamily: "'IBM Plex Mono', 'Fira Code', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Sora:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Sora', sans-serif; }
        .glow { box-shadow: 0 0 30px rgba(34, 197, 94, 0.15); }
        .glow-amber { box-shadow: 0 0 20px rgba(245, 158, 11, 0.15); }
        input, select, textarea { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(71, 85, 105, 0.4); color: #f1f5f9; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: rgba(34, 197, 94, 0.5); box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.1); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold font-display tracking-tight">
                <span className="text-emerald-500">MEDICAL</span> HISTORY
                <span className="text-slate-500 text-base ml-2">MAPPING SYSTEM</span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">20-Year Service Record Analysis</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <FileText className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium">{entries.length}</span>
                <span className="text-xs text-slate-500">entries</span>
              </div>
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                title="API Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowEntryForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Entry
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex gap-1 mt-4 overflow-x-auto scrollbar-hide pb-1">
            {views.map(view => (
              <button
                key={view.id}
                onClick={() => { setActiveView(view.id); setSelectedSystem(null); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeView === view.id
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <view.icon className="w-4 h-4" />
                {view.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        
        {/* DASHBOARD VIEW */}
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { label: 'Total Entries', value: entries.length, icon: FileText, color: 'emerald' },
                { label: 'Years Covered', value: years.length, icon: Calendar, color: 'sky' },
                { label: 'Body Systems', value: Object.values(entriesBySystem).filter(e => e.length > 0).length, icon: Activity, color: 'violet' },
                { label: 'Patterns Found', value: patterns.length, icon: TrendingUp, color: 'amber' },
                { label: 'Strong Claims', value: claimsAnalysis.filter(c => c.strength >= 60).length, icon: Target, color: 'emerald' },
                { label: 'Gaps Detected', value: patterns.filter(p => p.type === 'gap').length, icon: AlertTriangle, color: 'red' },
              ].map(stat => (
                <div key={stat.label} className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className={`w-4 h-4 text-${stat.color}-500`} />
                    <span className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <div className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Body Systems Grid */}
            <div>
              <h2 className="text-lg font-semibold font-display mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" />
                Body System Categories
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(BODY_SYSTEMS).map(([key, system]) => {
                  const count = entriesBySystem[key]?.length || 0;
                  const Icon = system.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => { setActiveView('entries'); setSelectedSystem(key); }}
                      className={`p-4 rounded-xl border transition-all hover:scale-[1.02] ${
                        count > 0 
                          ? `${colorClasses[system.color]} border` 
                          : 'bg-slate-800/30 border-slate-700/30 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className="w-5 h-5" />
                        <span className="text-xl font-bold">{count}</span>
                      </div>
                      <div className="mt-2 text-sm font-medium text-left">{system.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recent Entries & Quick Patterns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Entries */}
              <div className="p-5 bg-slate-800/40 rounded-xl border border-slate-700/30">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Recent Entries</h3>
                {entries.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p>No entries yet</p>
                    <p className="text-xs mt-1">Click "Add Entry" to start building your history</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {entries.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map(entry => (
                      <div key={entry.id} className="p-3 bg-slate-900/50 rounded-lg flex items-start justify-between">
                        <div>
                          <div className="text-xs text-slate-500">{formatDate(entry.date)}</div>
                          <div className="font-medium text-slate-200">{entry.issue}</div>
                          {entry.diagnosis && <div className="text-xs text-emerald-400 mt-0.5">{entry.diagnosis}</div>}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs ${colorClasses[BODY_SYSTEMS[entry.bodySystem]?.color || 'slate']}`}>
                          {BODY_SYSTEMS[entry.bodySystem]?.name || 'Other'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Detected Patterns */}
              <div className="p-5 bg-slate-800/40 rounded-xl border border-slate-700/30">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Detected Patterns</h3>
                {patterns.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <TrendingUp className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p>No patterns detected yet</p>
                    <p className="text-xs mt-1">Add more entries to identify trends</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {patterns.slice(0, 5).map((pattern, idx) => (
                      <div key={idx} className={`p-3 rounded-lg border ${
                        pattern.type === 'recurring' ? 'bg-amber-500/10 border-amber-500/30' :
                        pattern.type === 'escalation' ? 'bg-red-500/10 border-red-500/30' :
                        'bg-purple-500/10 border-purple-500/30'
                      }`}>
                        <div className="flex items-center gap-2">
                          {pattern.type === 'recurring' && <AlertCircle className="w-4 h-4 text-amber-400" />}
                          {pattern.type === 'escalation' && <TrendingUp className="w-4 h-4 text-red-400" />}
                          {pattern.type === 'gap' && <AlertTriangle className="w-4 h-4 text-purple-400" />}
                          <span className="text-sm font-medium capitalize">{pattern.type}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {pattern.type === 'recurring' && `"${pattern.issue}" appears ${pattern.count} times`}
                          {pattern.type === 'escalation' && `"${pattern.issue}" escalated from ${pattern.from} to ${pattern.to}`}
                          {pattern.type === 'gap' && `${pattern.months} month gap in "${pattern.issue}" treatment`}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Top Claims Preview */}
            {claimsAnalysis.length > 0 && (
              <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-slate-800/40 rounded-xl border border-emerald-500/20 glow">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Strongest Potential Claims
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {claimsAnalysis.slice(0, 3).map(claim => (
                    <div key={claim.system} className="p-4 bg-slate-900/60 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-200">{claim.name}</span>
                        <span className={`text-lg font-bold ${
                          claim.strength >= 70 ? 'text-emerald-400' :
                          claim.strength >= 50 ? 'text-amber-400' : 'text-slate-400'
                        }`}>{claim.strength}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            claim.strength >= 70 ? 'bg-emerald-500' :
                            claim.strength >= 50 ? 'bg-amber-500' : 'bg-slate-500'
                          }`}
                          style={{ width: `${claim.strength}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">{claim.entryCount} entries • Rating: {claim.ratingGuidance.common}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TIMELINE VIEW */}
        {activeView === 'timeline' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold font-display flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-500" />
                Chronological Timeline
              </h2>
              <div className="flex items-center gap-2">
                <select
                  value={filterYear}
                  onChange={e => setFilterYear(e.target.value)}
                  className="px-3 py-1.5 rounded-lg text-sm"
                >
                  <option value="all">All Years</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {years.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <Clock className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No entries to display</p>
                <p className="text-sm mt-1">Add medical records to see your timeline</p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-slate-600 to-slate-700" />
                
                {(filterYear === 'all' ? years : [parseInt(filterYear)]).map((year, yearIdx) => (
                  <div key={year} className="mb-8">
                    {/* Year marker */}
                    <div className="relative flex items-center justify-center mb-6">
                      <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-900 z-10" />
                      <span className="ml-12 md:ml-0 px-4 py-1.5 bg-emerald-500/20 text-emerald-400 font-bold rounded-full text-lg border border-emerald-500/30">
                        {year}
                      </span>
                    </div>
                    
                    {/* Entries for this year */}
                    <div className="space-y-4 ml-12 md:ml-0">
                      {(entriesByYear[year] || []).sort((a, b) => new Date(b.date) - new Date(a.date)).map((entry, idx) => {
                        const system = BODY_SYSTEMS[entry.bodySystem];
                        const Icon = system?.icon || FileText;
                        const isLeft = idx % 2 === 0;
                        return (
                          <div key={entry.id} className={`md:flex md:items-start ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                            <div className={`md:w-1/2 ${isLeft ? 'md:pl-8' : 'md:pr-8'}`}>
                              <div className={`p-4 bg-slate-800/60 rounded-xl border border-slate-700/40 hover:border-slate-600 transition-colors`}>
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-lg ${colorClasses[system?.color || 'slate']}`}>
                                      <Icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs text-slate-500">{formatDate(entry.date)}</span>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded text-xs ${colorClasses[
                                    entry.severity === 'severe' ? 'red' :
                                    entry.severity === 'significant' ? 'orange' :
                                    entry.severity === 'chronic' ? 'purple' :
                                    entry.severity === 'moderate' ? 'yellow' : 'slate'
                                  ]}`}>
                                    {entry.severity}
                                  </span>
                                </div>
                                <h4 className="font-semibold text-slate-100">{entry.issue}</h4>
                                {entry.diagnosis && (
                                  <p className="text-sm text-emerald-400 mt-1">Dx: {entry.diagnosis}</p>
                                )}
                                {entry.treatment && (
                                  <p className="text-xs text-slate-400 mt-1">Tx: {entry.treatment}</p>
                                )}
                                {entry.dutyImpact && (
                                  <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                                    <Flag className="w-3 h-3" /> {entry.dutyImpact}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-700/50">
                                  <span className="text-xs text-slate-500">{entry.docSource || 'No source'}</span>
                                </div>
                              </div>
                            </div>
                            <div className="hidden md:block w-4 h-4 rounded-full bg-slate-700 border-2 border-slate-600 absolute left-1/2 transform -translate-x-1/2 mt-4" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BODY SYSTEMS VIEW */}
        {activeView === 'systems' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold font-display flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              Body Systems Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(BODY_SYSTEMS).map(([key, system]) => {
                const sysEntries = entriesBySystem[key] || [];
                const Icon = system.icon;
                const rating = VA_RATING_GUIDANCE[key];
                
                return (
                  <div 
                    key={key} 
                    className={`p-5 rounded-xl border transition-all ${
                      sysEntries.length > 0 
                        ? `bg-slate-800/50 border-slate-700/50 hover:border-${system.color}-500/30` 
                        : 'bg-slate-800/20 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${colorClasses[system.color]}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-100">{system.name}</h3>
                          <p className="text-xs text-slate-500">{sysEntries.length} entries</p>
                        </div>
                      </div>
                      {sysEntries.length > 0 && (
                        <button
                          onClick={() => { setActiveView('entries'); setSelectedSystem(key); }}
                          className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                        >
                          View All <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    
                    {rating && (
                      <div className="p-3 bg-slate-900/50 rounded-lg mt-3">
                        <div className="text-xs text-slate-500 mb-1">VA Rating Range</div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-400">{rating.common}</span>
                          <span className="text-xs text-slate-400">(max: {rating.range})</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{rating.note}</p>
                      </div>
                    )}
                    
                    {sysEntries.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {sysEntries.slice(0, 3).map(entry => (
                          <div key={entry.id} className="text-xs text-slate-400 flex items-center gap-2">
                            <span className="text-slate-600">•</span>
                            <span className="truncate">{entry.issue}</span>
                            <span className="text-slate-600 ml-auto">{getYear(entry.date)}</span>
                          </div>
                        ))}
                        {sysEntries.length > 3 && (
                          <div className="text-xs text-slate-500">+{sysEntries.length - 3} more</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ENTRIES VIEW */}
        {activeView === 'entries' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search entries..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg text-sm"
                  />
                </div>
              </div>
              <select
                value={filterYear}
                onChange={e => setFilterYear(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm"
              >
                <option value="all">All Years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <select
                value={selectedSystem || ''}
                onChange={e => setSelectedSystem(e.target.value || null)}
                className="px-3 py-2 rounded-lg text-sm"
              >
                <option value="">All Systems</option>
                {Object.entries(BODY_SYSTEMS).map(([key, sys]) => (
                  <option key={key} value={key}>{sys.name}</option>
                ))}
              </select>
              {(searchTerm || filterYear !== 'all' || selectedSystem) && (
                <button
                  onClick={() => { setSearchTerm(''); setFilterYear('all'); setSelectedSystem(null); }}
                  className="px-3 py-2 text-sm text-slate-400 hover:text-slate-200"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Entries List */}
            {filteredEntries.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">{entries.length === 0 ? 'No entries yet' : 'No matching entries'}</p>
                <button
                  onClick={() => setShowEntryForm(true)}
                  className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm"
                >
                  Add First Entry
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEntries.map(entry => {
                  const system = BODY_SYSTEMS[entry.bodySystem];
                  const Icon = system?.icon || FileText;
                  return (
                    <div key={entry.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/40 hover:border-slate-600 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className={`p-2.5 rounded-lg ${colorClasses[system?.color || 'slate']}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="font-semibold text-slate-100">{entry.issue}</h4>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {formatDate(entry.date)} • {system?.name || 'Other'}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-xs ${colorClasses[
                                entry.severity === 'severe' ? 'red' :
                                entry.severity === 'significant' ? 'orange' :
                                entry.severity === 'chronic' ? 'purple' :
                                entry.severity === 'moderate' ? 'yellow' : 'slate'
                              ]}`}>
                                {entry.severity}
                              </span>
                              <button
                                onClick={() => { setEditingEntry(entry); setShowEntryForm(true); }}
                                className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 rounded"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteEntry(entry.id)}
                                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-700/50 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                            {entry.diagnosis && (
                              <div className="p-2 bg-emerald-500/10 rounded border border-emerald-500/20">
                                <span className="text-xs text-emerald-400 font-medium">Diagnosis:</span>
                                <p className="text-sm text-slate-300">{entry.diagnosis}</p>
                              </div>
                            )}
                            {entry.treatment && (
                              <div className="p-2 bg-sky-500/10 rounded border border-sky-500/20">
                                <span className="text-xs text-sky-400 font-medium">Treatment:</span>
                                <p className="text-sm text-slate-300">{entry.treatment}</p>
                              </div>
                            )}
                            {entry.dutyImpact && (
                              <div className="p-2 bg-amber-500/10 rounded border border-amber-500/20">
                                <span className="text-xs text-amber-400 font-medium">Duty Impact:</span>
                                <p className="text-sm text-slate-300">{entry.dutyImpact}</p>
                              </div>
                            )}
                            {entry.followUp && (
                              <div className="p-2 bg-purple-500/10 rounded border border-purple-500/20">
                                <span className="text-xs text-purple-400 font-medium">Follow-up:</span>
                                <p className="text-sm text-slate-300">{entry.followUp}</p>
                              </div>
                            )}
                          </div>

                          {entry.notes && (
                            <div className="mt-3 p-2 bg-slate-900/50 rounded">
                              <p className="text-xs text-slate-400">{entry.notes}</p>
                            </div>
                          )}

                          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-700/30">
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <FileText className="w-3 h-3" /> {entry.docSource || 'No source specified'}
                            </span>
                            {entry.isRecurrence && (
                              <span className="text-xs text-amber-400 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Recurrence
                              </span>
                            )}
                            {entry.hasGap && (
                              <span className="text-xs text-red-400 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Gap in records
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PATTERNS VIEW */}
        {activeView === 'patterns' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold font-display flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Pattern Analysis
            </h2>

            {patterns.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No patterns detected yet</p>
                <p className="text-sm mt-1">Add more entries to identify recurring conditions, escalations, and gaps</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recurring Conditions */}
                <div className="p-5 bg-amber-500/10 rounded-xl border border-amber-500/20">
                  <h3 className="flex items-center gap-2 text-amber-400 font-semibold mb-4">
                    <AlertCircle className="w-5 h-5" />
                    Recurring Conditions
                  </h3>
                  {patterns.filter(p => p.type === 'recurring').length === 0 ? (
                    <p className="text-sm text-slate-500">No recurring patterns (3+ occurrences)</p>
                  ) : (
                    <div className="space-y-3">
                      {patterns.filter(p => p.type === 'recurring').map((p, i) => (
                        <div key={i} className="p-3 bg-slate-900/50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-200 capitalize">{p.issue}</span>
                            <span className="text-amber-400 font-bold">{p.count}x</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Strong pattern for VA claim</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Escalations */}
                <div className="p-5 bg-red-500/10 rounded-xl border border-red-500/20">
                  <h3 className="flex items-center gap-2 text-red-400 font-semibold mb-4">
                    <TrendingUp className="w-5 h-5" />
                    Condition Escalations
                  </h3>
                  {patterns.filter(p => p.type === 'escalation').length === 0 ? (
                    <p className="text-sm text-slate-500">No escalations detected</p>
                  ) : (
                    <div className="space-y-3">
                      {patterns.filter(p => p.type === 'escalation').map((p, i) => (
                        <div key={i} className="p-3 bg-slate-900/50 rounded-lg">
                          <span className="font-medium text-slate-200 capitalize">{p.issue}</span>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs px-2 py-0.5 bg-slate-700 rounded">{p.from}</span>
                            <ArrowRight className="w-4 h-4 text-red-400" />
                            <span className="text-xs px-2 py-0.5 bg-red-500/30 text-red-300 rounded">{p.to}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Documentation Gaps */}
                <div className="p-5 bg-purple-500/10 rounded-xl border border-purple-500/20">
                  <h3 className="flex items-center gap-2 text-purple-400 font-semibold mb-4">
                    <AlertTriangle className="w-5 h-5" />
                    Documentation Gaps
                  </h3>
                  {patterns.filter(p => p.type === 'gap').length === 0 ? (
                    <p className="text-sm text-slate-500">No significant gaps (12+ months)</p>
                  ) : (
                    <div className="space-y-3">
                      {patterns.filter(p => p.type === 'gap').map((p, i) => (
                        <div key={i} className="p-3 bg-slate-900/50 rounded-lg">
                          <span className="font-medium text-slate-200 capitalize">{p.issue}</span>
                          <p className="text-xs text-purple-400 mt-1">{p.months} month gap</p>
                          <p className="text-xs text-slate-500">{formatDate(p.from)} → {formatDate(p.to)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Condition Chains / Connections */}
            <div className="p-5 bg-slate-800/40 rounded-xl border border-slate-700/30">
              <h3 className="flex items-center gap-2 text-emerald-400 font-semibold mb-4">
                <Link2 className="w-5 h-5" />
                Linked Condition Chains
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Group related conditions that may support secondary claims (e.g., back pain → nerve damage → sleep issues)
              </p>
              
              {conditionChains.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-slate-700 rounded-lg">
                  <Link2 className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                  <p className="text-sm text-slate-500">No condition chains defined</p>
                  <button
                    onClick={() => addConditionChain('New Chain', 'Describe the connection')}
                    className="mt-3 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm"
                  >
                    Create Chain
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {conditionChains.map(chain => (
                    <div key={chain.id} className="p-4 bg-slate-900/50 rounded-lg">
                      <div className="font-medium text-slate-200">{chain.name}</div>
                      <p className="text-xs text-slate-500 mt-1">{chain.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CLAIMS ANALYSIS VIEW */}
        {activeView === 'claims' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold font-display flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-500" />
                VA Claims Analysis
              </h2>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Spreadsheet
              </button>
            </div>

            {claimsAnalysis.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <Target className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No claims data yet</p>
                <p className="text-sm mt-1">Add medical entries to generate claims analysis</p>
              </div>
            ) : (
              <>
                {/* Ranked Claims List */}
                <div className="space-y-4">
                  {claimsAnalysis.map((claim, idx) => {
                    const system = BODY_SYSTEMS[claim.system];
                    const Icon = system?.icon || Activity;
                    return (
                      <div key={claim.system} className={`p-5 rounded-xl border ${
                        claim.strength >= 70 ? 'bg-emerald-500/10 border-emerald-500/30 glow' :
                        claim.strength >= 50 ? 'bg-amber-500/10 border-amber-500/30' :
                        'bg-slate-800/40 border-slate-700/30'
                      }`}>
                        <div className="flex items-start gap-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 text-xl font-bold text-slate-400">
                            #{idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${colorClasses[system?.color || 'slate']}`}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg text-slate-100">{claim.name}</h3>
                                  <p className="text-sm text-slate-400">{claim.entryCount} documented entries</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`text-3xl font-bold ${
                                  claim.strength >= 70 ? 'text-emerald-400' :
                                  claim.strength >= 50 ? 'text-amber-400' : 'text-slate-400'
                                }`}>{claim.strength}%</div>
                                <div className="text-xs text-slate-500">claim strength</div>
                              </div>
                            </div>

                            {/* Strength indicators */}
                            <div className="flex flex-wrap gap-2 mt-4">
                              {claim.hasMultipleVisits && (
                                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Multiple Visits
                                </span>
                              )}
                              {claim.hasDiagnosis && (
                                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Has Diagnosis
                                </span>
                              )}
                              {claim.hasDutyImpact && (
                                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Duty Impact
                                </span>
                              )}
                              {claim.hasChronicPattern && (
                                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Chronic Pattern
                                </span>
                              )}
                              {claim.hasEscalation && (
                                <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" /> Escalation
                                </span>
                              )}
                              {claim.gaps > 0 && (
                                <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" /> {claim.gaps} Gap(s)
                                </span>
                              )}
                            </div>

                            {/* Rating guidance */}
                            <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-slate-400">Typical VA Rating</span>
                                <span className="font-bold text-emerald-400">{claim.ratingGuidance.common}</span>
                              </div>
                              <p className="text-xs text-slate-500">{claim.ratingGuidance.note}</p>
                            </div>

                            {/* Missing documentation */}
                            {claim.missingDocs.length > 0 && (
                              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-2">
                                  <FileWarning className="w-4 h-4" />
                                  Missing Documentation
                                </div>
                                <ul className="space-y-1">
                                  {claim.missingDocs.map((doc, i) => (
                                    <li key={i} className="text-xs text-slate-400 flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                      {doc}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {/* Narrative Summary */}
                  <div className="p-5 bg-slate-800/40 rounded-xl border border-slate-700/30">
                    <h3 className="flex items-center gap-2 text-emerald-400 font-semibold mb-4">
                      <FileText className="w-5 h-5" />
                      Narrative Summary Template
                    </h3>
                    <div className="prose prose-sm prose-invert">
                      {claimsAnalysis.slice(0, 3).map(claim => (
                        <div key={claim.system} className="mb-4 p-3 bg-slate-900/50 rounded-lg">
                          <h4 className="text-sm font-semibold text-slate-200 mb-1">{claim.name}</h4>
                          <p className="text-xs text-slate-400">
                            Service member has {claim.entryCount} documented medical encounters for {claim.name.toLowerCase()} issues
                            {claim.hasDiagnosis && ', with confirmed diagnosis'}
                            {claim.hasDutyImpact && ', resulting in documented duty limitations'}
                            {claim.hasChronicPattern && ', showing chronic/ongoing pattern'}
                            . Evidence supports service connection for VA disability consideration.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Missing Records Checklist */}
                  <div className="p-5 bg-slate-800/40 rounded-xl border border-slate-700/30">
                    <h3 className="flex items-center gap-2 text-amber-400 font-semibold mb-4">
                      <ClipboardList className="w-5 h-5" />
                      Missing Records Checklist
                    </h3>
                    <div className="space-y-2">
                      {claimsAnalysis.flatMap(c => c.missingDocs.map(d => ({ claim: c.name, doc: d }))).length === 0 ? (
                        <div className="flex items-center gap-2 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm">No critical documentation gaps identified</span>
                        </div>
                      ) : (
                        claimsAnalysis.flatMap(c => c.missingDocs.map(d => ({ claim: c.name, doc: d }))).map((item, i) => (
                          <div key={i} className="flex items-start gap-3 p-2 bg-slate-900/50 rounded">
                            <input type="checkbox" className="mt-1 rounded" />
                            <div>
                              <span className="text-sm text-slate-200">{item.doc}</span>
                              <span className="text-xs text-slate-500 block">for {item.claim}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Entry Form Modal */}
      {showEntryForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-3xl my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-700">
              <h3 className="text-lg font-semibold font-display">
                {editingEntry ? 'Edit Medical Entry' : 'Add Medical Entry'}
              </h3>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!editingEntry && openAIKey && (
              <div className="p-4 border-b border-slate-700 bg-emerald-500/5">
                <button
                  onClick={() => { setShowParser(true); setShowEntryForm(false); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold rounded-lg transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Parse Document with AI
                  <Sparkles className="w-4 h-4" />
                </button>
                <p className="text-xs text-center text-slate-500 mt-2">
                  Paste medical documents and let AI extract the information
                </p>
              </div>
            )}
            
            <div className="p-5 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    value={editingEntry ? editingEntry.date : newEntry.date}
                    onChange={e => editingEntry 
                      ? setEditingEntry({...editingEntry, date: e.target.value})
                      : setNewEntry({...newEntry, date: e.target.value})
                    }
                    className="w-full px-3 py-2 rounded-lg text-sm"
                  />
                </div>

                {/* Body System */}
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Body System
                  </label>
                  <select
                    value={editingEntry ? editingEntry.bodySystem : newEntry.bodySystem}
                    onChange={e => editingEntry 
                      ? setEditingEntry({...editingEntry, bodySystem: e.target.value})
                      : setNewEntry({...newEntry, bodySystem: e.target.value})
                    }
                    className="w-full px-3 py-2 rounded-lg text-sm"
                  >
                    <option value="">Auto-detect from issue</option>
                    {Object.entries(BODY_SYSTEMS).map(([key, sys]) => (
                      <option key={key} value={key}>{sys.name}</option>
                    ))}
                  </select>
                </div>

                {/* Issue */}
                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Issue / Symptom / Condition *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Low back pain, Anxiety, Hearing loss..."
                    value={editingEntry ? editingEntry.issue : newEntry.issue}
                    onChange={e => editingEntry 
                      ? setEditingEntry({...editingEntry, issue: e.target.value})
                      : setNewEntry({...newEntry, issue: e.target.value})
                    }
                    className="w-full px-3 py-2 rounded-lg text-sm"
                  />
                </div>

                {/* Diagnosis */}
                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Diagnosis Given
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Lumbar strain, GAD, Bilateral tinnitus..."
                    value={editingEntry ? editingEntry.diagnosis : newEntry.diagnosis}
                    onChange={e => editingEntry 
                      ? setEditingEntry({...editingEntry, diagnosis: e.target.value})
                      : setNewEntry({...newEntry, diagnosis: e.target.value})
                    }
                    className="w-full px-3 py-2 rounded-lg text-sm"
                  />
                </div>

                {/* Treatment */}
                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Treatment / Medication / Profile Change
                  </label>
                  <textarea
                    placeholder="e.g., Prescribed Naproxen 500mg, Referred to PT, Given P3 profile..."
                    rows={2}
                    value={editingEntry ? editingEntry.treatment : newEntry.treatment}
                    onChange={e => editingEntry 
                      ? setEditingEntry({...editingEntry, treatment: e.target.value})
                      : setNewEntry({...newEntry, treatment: e.target.value})
                    }
                    className="w-full px-3 py-2 rounded-lg text-sm"
                  />
                </div>

                {/* Duty Impact */}
                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Duty Impact
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Light duty 30 days, No PT test, Removed from deployment..."
                    value={editingEntry ? editingEntry.dutyImpact : newEntry.dutyImpact}
                    onChange={e => editingEntry 
                      ? setEditingEntry({...editingEntry, dutyImpact: e.target.value})
                      : setNewEntry({...newEntry, dutyImpact: e.target.value})
                    }
                    className="w-full px-3 py-2 rounded-lg text-sm"
                  />
                </div>

                {/* Severity */}
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Severity
                  </label>
                  <select
                    value={editingEntry ? editingEntry.severity : newEntry.severity}
                    onChange={e => editingEntry 
                      ? setEditingEntry({...editingEntry, severity: e.target.value})
                      : setNewEntry({...newEntry, severity: e.target.value})
                    }
                    className="w-full px-3 py-2 rounded-lg text-sm"
                  >
                    {SEVERITY_LEVELS.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                {/* Doc Source */}
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Documentation Source
                  </label>
                  <select
                    value={editingEntry ? editingEntry.docSource : newEntry.docSource}
                    onChange={e => editingEntry 
                      ? setEditingEntry({...editingEntry, docSource: e.target.value})
                      : setNewEntry({...newEntry, docSource: e.target.value})
                    }
                    className="w-full px-3 py-2 rounded-lg text-sm"
                  >
                    <option value="">Select source...</option>
                    {DOC_SOURCES.map(src => (
                      <option key={src} value={src}>{src}</option>
                    ))}
                  </select>
                </div>

                {/* Follow-up */}
                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Follow-up / Recurrence
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Follow-up in 2 weeks, Referred to specialist, Condition recurred..."
                    value={editingEntry ? editingEntry.followUp : newEntry.followUp}
                    onChange={e => editingEntry 
                      ? setEditingEntry({...editingEntry, followUp: e.target.value})
                      : setNewEntry({...newEntry, followUp: e.target.value})
                    }
                    className="w-full px-3 py-2 rounded-lg text-sm"
                  />
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Additional Notes / Context
                  </label>
                  <textarea
                    placeholder="e.g., Occurred during deployment, Sleep issues since 2013, Related to training injury..."
                    rows={3}
                    value={editingEntry ? editingEntry.notes : newEntry.notes}
                    onChange={e => editingEntry 
                      ? setEditingEntry({...editingEntry, notes: e.target.value})
                      : setNewEntry({...newEntry, notes: e.target.value})
                    }
                    className="w-full px-3 py-2 rounded-lg text-sm"
                  />
                </div>

                {/* Flags */}
                <div className="md:col-span-2 flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingEntry ? editingEntry.isRecurrence : newEntry.isRecurrence}
                      onChange={e => editingEntry 
                        ? setEditingEntry({...editingEntry, isRecurrence: e.target.checked})
                        : setNewEntry({...newEntry, isRecurrence: e.target.checked})
                      }
                      className="rounded"
                    />
                    <span className="text-sm text-slate-300">This is a recurrence of previous issue</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingEntry ? editingEntry.hasGap : newEntry.hasGap}
                      onChange={e => editingEntry 
                        ? setEditingEntry({...editingEntry, hasGap: e.target.checked})
                        : setNewEntry({...newEntry, hasGap: e.target.checked})
                      }
                      className="rounded"
                    />
                    <span className="text-sm text-slate-300">Gap in documentation for this condition</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-slate-700">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={editingEntry ? updateEntry : addEntry}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg"
              >
                {editingEntry ? 'Update Entry' : 'Save Entry'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Document Parser Modal */}
      {showParser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-700">
              <h3 className="text-lg font-semibold font-display flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                AI Medical Document Parser
              </h3>
              <button onClick={() => { setShowParser(false); setDocumentText(''); setParsedData(null); }} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 flex-1 overflow-y-auto">
              {!parsedData ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm text-slate-300 mb-2">
                      Paste Medical Document Text
                    </label>
                    <textarea
                      value={documentText}
                      onChange={e => setDocumentText(e.target.value)}
                      placeholder="Paste AHLTA notes, consultation reports, sick call records, lab results, or any medical documentation here..."
                      rows={20}
                      className="w-full px-3 py-2 rounded-lg text-sm bg-slate-900/80 border border-slate-600 text-slate-200 font-mono"
                    />
                  </div>

                  <div className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-lg mb-4">
                    <p className="text-sm text-sky-400 mb-2 font-semibold">Supported Formats:</p>
                    <ul className="text-xs text-slate-400 space-y-1">
                      <li>• AHLTA Consultation Notes</li>
                      <li>• Sick Call Records</li>
                      <li>• ER Visit Summaries</li>
                      <li>• Specialist Reports</li>
                      <li>• Lab Results</li>
                      <li>• Imaging Reports</li>
                      <li>• Mental Health Notes</li>
                      <li>• Profile/Limitation Documents</li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Document parsed successfully! Review and edit below.
                      </p>
                      {parsedData.confidence && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          parsedData.confidence === 'high' ? 'bg-emerald-500/20 text-emerald-400' :
                          parsedData.confidence === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {parsedData.confidence} confidence
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Date</label>
                      <input
                        type="date"
                        value={parsedData.date || ''}
                        onChange={e => setParsedData({...parsedData, date: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg text-sm bg-slate-900/80 border border-slate-600 text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Severity</label>
                      <select
                        value={parsedData.severity || 'moderate'}
                        onChange={e => setParsedData({...parsedData, severity: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg text-sm bg-slate-900/80 border border-slate-600 text-slate-200"
                      >
                        {SEVERITY_LEVELS.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Issue/Complaint</label>
                      <input
                        type="text"
                        value={parsedData.issue || ''}
                        onChange={e => setParsedData({...parsedData, issue: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg text-sm bg-slate-900/80 border border-slate-600 text-slate-200"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Diagnosis</label>
                      <input
                        type="text"
                        value={parsedData.diagnosis || ''}
                        onChange={e => setParsedData({...parsedData, diagnosis: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg text-sm bg-slate-900/80 border border-slate-600 text-slate-200"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Treatment</label>
                      <textarea
                        value={parsedData.treatment || ''}
                        onChange={e => setParsedData({...parsedData, treatment: e.target.value})}
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg text-sm bg-slate-900/80 border border-slate-600 text-slate-200"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Duty Impact</label>
                      <input
                        type="text"
                        value={parsedData.dutyImpact || ''}
                        onChange={e => setParsedData({...parsedData, dutyImpact: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg text-sm bg-slate-900/80 border border-slate-600 text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Document Source</label>
                      <select
                        value={parsedData.docSource || ''}
                        onChange={e => setParsedData({...parsedData, docSource: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg text-sm bg-slate-900/80 border border-slate-600 text-slate-200"
                      >
                        <option value="">Select source...</option>
                        {DOC_SOURCES.map(src => (
                          <option key={src} value={src}>{src}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Follow-up</label>
                      <input
                        type="text"
                        value={parsedData.followUp || ''}
                        onChange={e => setParsedData({...parsedData, followUp: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg text-sm bg-slate-900/80 border border-slate-600 text-slate-200"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Additional Notes</label>
                      <textarea
                        value={parsedData.notes || ''}
                        onChange={e => setParsedData({...parsedData, notes: e.target.value})}
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg text-sm bg-slate-900/80 border border-slate-600 text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-slate-700">
              <button
                onClick={() => { setShowParser(false); setDocumentText(''); setParsedData(null); }}
                className="px-4 py-2 text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              {!parsedData ? (
                <button
                  onClick={parseDocument}
                  disabled={!documentText.trim() || parsing}
                  className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {parsing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Analyze Document
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={saveParsedEntry}
                  className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Save Entry
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-slate-700">
              <h3 className="text-lg font-semibold font-display flex items-center gap-2">
                <Key className="w-5 h-5 text-emerald-500" />
                AI Settings
              </h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5">
              <div className="mb-4">
                <label className="block text-sm text-slate-300 mb-2">
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  value={openAIKey}
                  onChange={e => setOpenAIKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-3 py-2 rounded-lg text-sm bg-slate-900/80 border border-slate-600 text-slate-200"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Your API key is stored locally and never sent anywhere except OpenAI.
                </p>
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg mb-4">
                <p className="text-xs text-emerald-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Paste medical documents and let AI extract the information automatically
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={saveAPIKey}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg"
                >
                  Save Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
