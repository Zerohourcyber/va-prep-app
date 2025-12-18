import React from 'react';
import { Sparkles, Check } from 'lucide-react';

export default function YesNoQuestion({
  number,
  question,
  value,
  onChange,
  showExplanation = true,
  autoFillSuggestion = null,
  onAcceptAutoFill = null,
  threeWay = false // For questions with Yes/No/Unsure
}) {
  const answer = value?.answer;
  const explanation = value?.explanation || '';

  const handleAnswerChange = (newAnswer) => {
    onChange({
      ...value,
      answer: newAnswer,
      explanation: newAnswer === false ? '' : explanation
    });
  };

  const handleExplanationChange = (e) => {
    onChange({
      ...value,
      explanation: e.target.value
    });
  };

  const handleAcceptAutoFill = () => {
    if (autoFillSuggestion && onAcceptAutoFill) {
      onChange({
        answer: autoFillSuggestion.suggestedAnswer,
        explanation: autoFillSuggestion.suggestedExplanation
      });
      onAcceptAutoFill(autoFillSuggestion);
    }
  };

  return (
    <div className="py-3 border-b border-slate-700/30 last:border-b-0">
      <div className="flex items-start gap-3">
        {/* Question number */}
        <span className="text-slate-500 text-sm font-mono w-8 flex-shrink-0 pt-0.5">
          {number}
        </span>

        <div className="flex-1">
          {/* Question text and radio buttons */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
            <p className="flex-1 text-sm text-slate-200">{question}</p>

            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Yes */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`q${number}`}
                  checked={answer === true}
                  onChange={() => handleAnswerChange(true)}
                  className="w-4 h-4 border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500/50"
                />
                <span className="text-sm text-slate-300">Yes</span>
              </label>

              {/* No */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`q${number}`}
                  checked={answer === false}
                  onChange={() => handleAnswerChange(false)}
                  className="w-4 h-4 border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500/50"
                />
                <span className="text-sm text-slate-300">No</span>
              </label>

              {/* Unsure (optional) */}
              {threeWay && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`q${number}`}
                    checked={answer === 'unsure'}
                    onChange={() => handleAnswerChange('unsure')}
                    className="w-4 h-4 border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500/50"
                  />
                  <span className="text-sm text-slate-300">Unsure</span>
                </label>
              )}
            </div>
          </div>

          {/* Auto-fill suggestion */}
          {autoFillSuggestion && answer === null && (
            <div className="mt-2 flex items-start gap-2 p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
              <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-emerald-400 font-medium">
                  Auto-fill suggestion ({autoFillSuggestion.confidence} confidence)
                </p>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {autoFillSuggestion.suggestedExplanation}
                </p>
              </div>
              <button
                onClick={handleAcceptAutoFill}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded transition-colors"
              >
                <Check className="w-3 h-3" />
                Accept
              </button>
            </div>
          )}

          {/* Explanation field (shown when Yes is selected) */}
          {showExplanation && (answer === true || answer === 'unsure') && (
            <div className="mt-2">
              <label className="block text-xs text-slate-400 mb-1">
                {answer === 'unsure' ? 'If unsure, explain:' : 'If yes, explain:'}
              </label>
              <textarea
                value={explanation}
                onChange={handleExplanationChange}
                rows={2}
                className="w-full px-3 py-2 text-sm bg-slate-800/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 resize-none"
                placeholder="Include dates and details as applicable..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
