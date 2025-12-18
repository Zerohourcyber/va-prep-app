import React, { useState } from 'react';
import { X, Download, Shield, AlertTriangle } from 'lucide-react';
import { exportShaDbqPdf } from '../utils/shaDbqPdfGenerator';

export default function ExportModal({ formData, veteranName, onClose }) {
  const [sensitiveData, setSensitiveData] = useState({
    ssn: '',
    dodId: ''
  });
  const [signature, setSignature] = useState('');
  const [signatureDate, setSignatureDate] = useState(new Date().toISOString().split('T')[0]);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportShaDbqPdf(formData, sensitiveData, signature, signatureDate, veteranName);
      // Clear sensitive data from memory
      setSensitiveData({ ssn: '', dodId: '' });
      onClose();
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Format SSN as user types (XXX-XX-XXXX)
  const handleSsnChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 9) value = value.slice(0, 9);

    if (value.length > 5) {
      value = `${value.slice(0, 3)}-${value.slice(3, 5)}-${value.slice(5)}`;
    } else if (value.length > 3) {
      value = `${value.slice(0, 3)}-${value.slice(3)}`;
    }

    setSensitiveData({ ...sensitiveData, ssn: value });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="text-lg font-bold text-slate-100">Export SHA DBQ PDF</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Privacy notice */}
          <div className="flex items-start gap-3 p-3 bg-sky-500/10 rounded-lg border border-sky-500/30">
            <Shield className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-300">
              <strong className="text-sky-400">Privacy Protected:</strong> The information
              entered below is used only to generate your PDF and is NOT stored or transmitted.
              It is cleared from memory immediately after export.
            </div>
          </div>

          {/* SSN Input */}
          <div>
            <label className="block text-sm text-slate-300 mb-1">
              SSN (Social Security Number) <span className="text-slate-500">(optional)</span>
            </label>
            <input
              type="text"
              value={sensitiveData.ssn}
              onChange={handleSsnChange}
              placeholder="XXX-XX-XXXX"
              maxLength={11}
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 font-mono"
            />
          </div>

          {/* DoD ID Input */}
          <div>
            <label className="block text-sm text-slate-300 mb-1">
              DoD ID Number <span className="text-slate-500">(optional)</span>
            </label>
            <input
              type="text"
              value={sensitiveData.dodId}
              onChange={(e) => setSensitiveData({ ...sensitiveData, dodId: e.target.value })}
              placeholder="Enter DoD ID"
              maxLength={10}
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 font-mono"
            />
          </div>

          {/* Signature */}
          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Electronic Signature <span className="text-slate-500">(type your name)</span>
            </label>
            <input
              type="text"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Type your full name"
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Signature Date */}
          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Signature Date
            </label>
            <input
              type="date"
              value={signatureDate}
              onChange={(e) => setSignatureDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400">
              This form is for self-assessment purposes. Review all information before
              submitting to official VA channels. Consult with a VSO or legal representative
              if needed.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-300 hover:text-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Generating...' : 'Generate PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
