import React, { useState, useMemo } from 'react';
import { FileText, Download, Shield, AlertCircle, Sparkles, Crown } from 'lucide-react';
import { useFeatureLimits, PremiumBadge } from '../PremiumGate';
import ShaDbqForm from './ShaDbqForm';
import ExportModal from './components/ExportModal';
import { getInitialShaDbqState } from './utils/shaDbqQuestions';
import { countAllAutoFillSuggestions, generateAutoFillSuggestions } from './utils/autoFillMappings';

export default function ShaDbqTab({
  shaDbqData,
  setShaDbqData,
  medicalEntries,
  conditions,
  veteranName,
  isPremium
}) {
  const { canExportPDF } = useFeatureLimits();
  const [showExportModal, setShowExportModal] = useState(false);

  // Initialize form data if empty
  const formData = shaDbqData || getInitialShaDbqState();

  // Calculate completion percentage
  const completionStats = useMemo(() => {
    let totalFields = 0;
    let filledFields = 0;

    const countFields = (obj, path = '') => {
      if (!obj || typeof obj !== 'object') return;

      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;

        if (key === 'notApplicable' || key === 'metadata') return;

        if (value && typeof value === 'object' && !Array.isArray(value)) {
          if ('answer' in value) {
            totalFields++;
            if (value.answer !== null && value.answer !== undefined && value.answer !== '') {
              filledFields++;
            }
          } else {
            countFields(value, currentPath);
          }
        } else if (Array.isArray(value)) {
          totalFields++;
          if (value.length > 0) filledFields++;
        } else if (key !== 'notApplicable') {
          totalFields++;
          if (value !== null && value !== undefined && value !== '') {
            filledFields++;
          }
        }
      });
    };

    countFields(formData);

    return {
      total: totalFields,
      filled: filledFields,
      percent: totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0
    };
  }, [formData]);

  // Generate auto-fill suggestions
  const autoFillSuggestions = useMemo(() => {
    return {
      generalMedical: generateAutoFillSuggestions(medicalEntries, conditions, 'generalMedical'),
      musculoskeletal: generateAutoFillSuggestions(medicalEntries, conditions, 'musculoskeletal'),
      hearing: generateAutoFillSuggestions(medicalEntries, conditions, 'hearing'),
      vision: generateAutoFillSuggestions(medicalEntries, conditions, 'vision'),
      headInjury: generateAutoFillSuggestions(medicalEntries, conditions, 'headInjury')
    };
  }, [medicalEntries, conditions]);

  const totalSuggestions = countAllAutoFillSuggestions(medicalEntries, conditions);

  // Premium gate
  if (!isPremium) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
          <Crown className="w-8 h-8 text-amber-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-100 mb-2">Premium Feature</h3>
        <p className="text-slate-400 text-center max-w-md mb-6">
          The SHA DBQ Self-Assessment tool is available to Premium members.
          Upgrade to complete the Separation Health Assessment form and export it as a PDF.
        </p>
        <button
          onClick={() => window.location.href = '?upgrade=true'}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold rounded-lg transition-all shadow-lg shadow-amber-500/20"
        >
          <Crown className="w-5 h-5" />
          Upgrade to Premium
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
        <div>
          <h2 className="text-xl font-bold font-display flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-500" />
            SHA DBQ Part A - Self-Assessment
            <PremiumBadge />
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Separation Health Assessment - Service Member Identification and Self-Assessment
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Auto-fill count */}
          {totalSuggestions > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400">{totalSuggestions} auto-fill suggestions</span>
            </div>
          )}

          {/* Progress */}
          <div className="text-right">
            <div className="text-xs text-slate-500 uppercase tracking-wider">Completion</div>
            <div className="text-2xl font-bold text-amber-500">{completionStats.percent}%</div>
          </div>

          {/* Export button */}
          <button
            onClick={() => setShowExportModal(true)}
            disabled={!canExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Privacy notice */}
      <div className="flex items-start gap-3 p-4 bg-sky-500/10 rounded-lg border border-sky-500/30">
        <Shield className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-slate-300">
          <strong className="text-sky-400">Privacy Protected:</strong> Sensitive information (SSN, DoD ID) is only
          entered at export time and is <strong>NOT stored</strong> in the application. Your form progress is saved
          locally and to your account, but sensitive identifiers remain private.
        </div>
      </div>

      {/* Info about auto-fill */}
      {totalSuggestions > 0 && (
        <div className="flex items-start gap-3 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
          <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-slate-300">
            <strong className="text-emerald-400">Auto-Fill Available:</strong> Based on your medical history entries,
            we've identified {totalSuggestions} questions that can be pre-filled. Look for the green badges
            in each section and click "Accept" to use the suggested answers.
          </div>
        </div>
      )}

      {/* Form */}
      <ShaDbqForm
        formData={formData}
        setFormData={setShaDbqData}
        autoFillSuggestions={autoFillSuggestions}
        veteranName={veteranName}
      />

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          formData={formData}
          veteranName={veteranName}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}
