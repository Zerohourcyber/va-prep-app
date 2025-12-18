import React from 'react';

export default function MultiSelectQuestion({
  label,
  options,
  value = [],
  onChange,
  columns = 2
}) {
  const handleToggle = (optionValue) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const gridCols = columns === 1 ? 'grid-cols-1' : columns === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2';

  return (
    <div className="py-2">
      {label && (
        <label className="block text-sm text-slate-300 mb-2">{label}</label>
      )}
      <div className={`grid ${gridCols} gap-2`}>
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-start gap-2 p-2 rounded hover:bg-slate-700/30 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={value.includes(option.value)}
              onChange={() => handleToggle(option.value)}
              className="mt-0.5 w-4 h-4 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500/50"
            />
            <span className="text-sm text-slate-300">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function RadioQuestion({
  label,
  options,
  value,
  onChange,
  name,
  inline = false
}) {
  const layoutClass = inline
    ? 'flex flex-wrap gap-4'
    : 'space-y-2';

  return (
    <div className="py-2">
      {label && (
        <label className="block text-sm text-slate-300 mb-2">{label}</label>
      )}
      <div className={layoutClass}>
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name={name}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="w-4 h-4 border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500/50"
            />
            <span className="text-sm text-slate-300">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function SelectQuestion({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select...'
}) {
  return (
    <div className="py-2">
      {label && (
        <label className="block text-sm text-slate-300 mb-1">{label}</label>
      )}
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm bg-slate-800/50 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500/50"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function TextQuestion({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  multiline = false,
  rows = 3
}) {
  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className="py-2">
      {label && (
        <label className="block text-sm text-slate-300 mb-1">{label}</label>
      )}
      <InputComponent
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={multiline ? rows : undefined}
        className={`w-full px-3 py-2 text-sm bg-slate-800/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 ${multiline ? 'resize-none' : ''}`}
      />
    </div>
  );
}

export function DateQuestion({
  label,
  value,
  onChange,
  format = 'date' // 'date' for YYYY-MM-DD, 'month' for YYYY-MM
}) {
  return (
    <div className="py-2">
      {label && (
        <label className="block text-sm text-slate-300 mb-1">{label}</label>
      )}
      <input
        type={format === 'month' ? 'month' : 'date'}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm bg-slate-800/50 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500/50"
      />
    </div>
  );
}
