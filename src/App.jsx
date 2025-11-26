import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2, AlertTriangle, CheckCircle2, FileText, Calculator, ClipboardList, Shield, Target, AlertCircle, Info, X, Edit2, Save } from 'lucide-react';

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

export default function App() {
  const [activeTab, setActiveTab] = useState('checklist');
  const [checklist, setChecklist] = useState(initialChecklist);
  const [conditions, setConditions] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [showConditionForm, setShowConditionForm] = useState(false);
  const [editingCondition, setEditingCondition] = useState(null);
  const [newCondition, setNewCondition] = useState({
    name: '', category: 'physical', evidence: '', dbqAvailable: false,
    nexusNeeded: false, inServiceProof: '', severity: 'moderate', estimatedRating: 30, notes: ''
  });

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
    { id: 'calculator', label: 'VA Math', icon: Calculator },
    { id: 'documents', label: 'Document Reqs', icon: Shield },
    { id: 'readiness', label: 'Readiness', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-4 md:p-6" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 glow">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight">
              <span className="text-amber-500">VA</span> RETIREMENT & DISABILITY
              <span className="text-slate-500 text-lg ml-2">PREP SYSTEM</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Comprehensive planning & tracking dashboard</p>
          </div>
          <div className="flex items-center gap-4">
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
            <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
              <div>
                <h2 className="text-lg font-semibold font-display">Condition & Item Tracking</h2>
                <p className="text-sm text-slate-400">Add conditions, symptoms, diagnoses, and documentation</p>
              </div>
              <button
                onClick={() => setShowConditionForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Entry
              </button>
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

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-8 p-4 text-center text-xs text-slate-600 border-t border-slate-800">
        VA Retirement & Disability Preparation System • Organizational Tool • Not Legal or Medical Advice
      </div>
    </div>
  );
}
