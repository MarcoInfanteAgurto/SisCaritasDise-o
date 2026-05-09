import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export function CustomSelect({ value, onChange, options, placeholder = 'Seleccionar...', className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const selectedOption = options.find((o) => (typeof o === 'object' ? o.value : o) === value);
  const displayLabel = selectedOption
    ? typeof selectedOption === 'object'
      ? selectedOption.label
      : selectedOption
    : placeholder;

  return (
    <div className={`custom-select ${className} ${open ? 'open' : ''}`} ref={ref}>
      <button
        type="button"
        className="custom-select-trigger"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`custom-select-value ${!selectedOption ? 'placeholder' : ''}`}>
          {displayLabel}
        </span>
        <ChevronDown size={14} className="custom-select-chevron" />
      </button>
      {open && (
        <div className="custom-select-dropdown">
          {options.map((opt) => {
            const optValue = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            const isActive = optValue === value;
            return (
              <button
                key={optValue}
                type="button"
                className={`custom-select-option ${isActive ? 'active' : ''}`}
                onClick={() => {
                  onChange(optValue);
                  setOpen(false);
                }}
              >
                {optLabel}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
