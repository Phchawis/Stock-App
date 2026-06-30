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

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', ...style }}>
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
        <div style={css(`
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
        `)}>
          {filteredOpts.length > 0 ? (
            filteredOpts.map((o) => (
              <div
                key={o.value}
                onClick={() => {
                  onChange(o.value);
                  setIsOpen(false);
                }}
                style={css(`
                  padding:10px 14px;
                  cursor:pointer;
                  font:var(--text-sm)/1.3 var(--font-body);
                  color:var(--text-primary);
                  transition:background var(--dur-fast);
                  background:${String(o.value) === String(value) ? 'var(--brand-50)' : 'transparent'};
                  font-weight:${String(o.value) === String(value) ? '600' : '400'};
                `)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = String(o.value) === String(value) ? 'var(--brand-100)' : 'var(--slate-50)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = String(o.value) === String(value) ? 'var(--brand-50)' : 'transparent';
                }}
              >
                {o.label}
              </div>
            ))
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
