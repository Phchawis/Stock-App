import React from 'react';

/** Tabs — underline-style navigation for switching register views / doc-detail panels. */
export function Tabs({ tabs = [], value, onChange, style }) {
  // One underline that travels to the selected tab, instead of one fading out
  // while another fades in. Until it has measured itself, each tab keeps its
  // own border — so the active tab is never shown without an underline, even
  // for the first frame or where layout cannot be read.
  const listRef = React.useRef(null);
  const [ind, setInd] = React.useState(null);
  React.useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;
    const measure = () => {
      const active = list.querySelector('[role="tab"][aria-selected="true"]');
      if (!active || !active.offsetWidth) { setInd(null); return; }
      setInd({ x: active.offsetLeft, w: active.offsetWidth });
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [value, tabs.length]);

  return (
    <div ref={listRef} role="tablist" className="qms-tablist" style={{
      display: 'flex', gap: 4, borderBottom: '1px solid var(--border-subtle)', ...style,
    }}>
      {tabs.map((t) => {
        const key = typeof t === 'string' ? t : t.value;
        const label = typeof t === 'string' ? t : t.label;
        const count = typeof t === 'object' ? t.count : undefined;
        const active = key === value;
        return (
          <button key={key} role="tab" aria-selected={active} onClick={() => onChange && onChange(key)}
            className="qms-tab"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '10px 14px', marginBottom: -1, whiteSpace: 'nowrap', flexShrink: 0,
              borderBottom: '2px solid ' + (active && !ind ? 'var(--teal-700)' : 'transparent'),
              color: active ? 'var(--teal-700)' : 'var(--text-secondary)',
              font: (active ? 'var(--fw-semibold) ' : 'var(--fw-medium) ') + 'var(--text-base)/1 var(--font-body)',
              transition: 'color var(--dur-fast), border-color var(--dur-fast)',
            }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            {label}
            {count != null && (
              <span style={{
                font: 'var(--fw-semibold) var(--text-2xs)/1 var(--font-mono)',
                background: active ? 'var(--teal-100)' : 'var(--slate-100)',
                color: active ? 'var(--teal-700)' : 'var(--text-tertiary)',
                padding: '2px 6px', borderRadius: 'var(--radius-pill)',
              }}>{count}</span>
            )}
          </button>
        );
      })}
      {ind && (
        <span aria-hidden="true" className="qms-tab-ind"
          style={{ transform: `translateX(${ind.x}px) scaleX(${ind.w})` }} />
      )}
    </div>
  );
}
