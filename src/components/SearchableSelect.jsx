import React from 'react';
import { css } from '../css.js';

export function SearchableSelect({ label, required = false, options = [], placeholder = 'ค้นหาและเลือก...', value, onChange, style }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const containerRef = React.useRef(null);

  // Find currently selected label
  const selectedOpt = options.find(o => String(o.value) === String(value));
  
  // Update local search term when value changes or when opening/closing
  React.useEffect(() => {
    if (!isOpen) {
      setSearch(selectedOpt ? selectedOpt.label : '');
    }
  }, [value, isOpen, selectedOpt]);

  // Click outside detection
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search input
  const filteredOpts = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const [highlightedIndex, setHighlightedIndex] = React.useState(0);

  // Reset highlightedIndex when search query or openness changes
  React.useEffect(() => {
    setHighlightedIndex(0);
  }, [search, isOpen]);

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prev) => (prev + 1) % Math.max(1, filteredOpts.length));
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prev) => (prev - 1 + filteredOpts.length) % Math.max(1, filteredOpts.length));
      e.preventDefault();
    } else if (e.key === 'Enter') {
      if (filteredOpts.length > 0 && highlightedIndex >= 0 && highlightedIndex < filteredOpts.length) {
        onChange(filteredOpts[highlightedIndex].value);
        setIsOpen(false);
      }
      e.preventDefault();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      e.preventDefault();
    }
  };

  return (
    <div 
      ref={containerRef} 
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', ...style }}
    >
      {label && (
        <label style={{ font: 'var(--type-ui)', color: 'var(--text-secondary)' }}>
          {label}{required && <span style={{ color: 'var(--red-600)', marginLeft: 2 }}>*</span>}
        </label>
      )}
      
      <div style={{ position: 'relative', display: 'flex' }}>
        <input
          type="text"
          placeholder={placeholder}
          value={search}
          onFocus={() => {
            setIsOpen(true);
            setSearch(''); // clear search on focus so user can type cleanly
          }}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-autocomplete="list"
          aria-controls="select-options-list"
          style={css(`
            width:100%;
            height:40px;
            box-sizing:border-box;
            padding:0 36px 0 12px;
            background:var(--white);
            border:1px solid ${isOpen ? 'var(--border-brand)' : 'var(--border-default)'};
            border-radius:var(--radius-md);
            font:var(--type-body);
            color:var(--text-primary);
            outline:none;
            cursor:pointer;
            box-shadow:${isOpen ? 'var(--shadow-focus)' : 'none'};
            transition:border-color var(--dur-fast), box-shadow var(--dur-fast);
          `)}
        />
        <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-tertiary)', display: 'flex' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {isOpen ? <path d="M18 15l-6-6-6 6" /> : <path d="M6 9l6 6 6-6" />}
          </svg>
        </span>
      </div>

      {/* Options Dropdown Popover */}
      {isOpen && (
        <div 
          id="select-options-list"
          role="listbox"
          style={css(`
            position:absolute;
            top:calc(100% + 4px);
            left:0;
            right:0;
            max-height:220px;
            overflow-y:auto;
            background:var(--white);
            border:1px solid var(--border-subtle);
            border-radius:var(--radius-md);
            box-shadow:var(--shadow-lg);
            z-index:90;
            display:flex;
            flex-direction:column;
            padding:4px 0;
          `)}
        >
          {filteredOpts.length > 0 ? (
            filteredOpts.map((o, idx) => {
              const isSelected = String(o.value) === String(value);
              const isHighlighted = idx === highlightedIndex;
              return (
                <div
                  key={o.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(o.value);
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  style={css(`
                    padding:10px 14px;
                    cursor:pointer;
                    font:var(--text-sm)/1.3 var(--font-body);
                    color:var(--text-primary);
                    transition:background var(--dur-fast);
                    background:${isHighlighted ? 'var(--slate-50)' : (isSelected ? 'var(--brand-50)' : 'transparent')};
                    font-weight:${isSelected || isHighlighted ? '600' : '400'};
                  `)}
                >
                  {o.label}
                </div>
              );
            })
          ) : (
            <div style={css(`padding:12px 14px; text-align:center; font:var(--text-xs)/1.2 var(--font-body); color:var(--text-tertiary);`)}>
              ไม่พบข้อมูลน้ำยาเคมีที่ค้นหา
            </div>
          )}
        </div>
      )}
    </div>
  );
}
