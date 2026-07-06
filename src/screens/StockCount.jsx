import React from 'react';
import { css } from '../css.js';

export function StockCount({ v }) {
  const {
    isStockCount, stockCountList, stockCountForm, updateStockCountRow,
    submitStockCount, go, ic
  } = v;

  const [scannerInput, setScannerInput] = React.useState('');
  const [highlightedLotId, setHighlightedLotId] = React.useState(null);
  const inputRefs = React.useRef({});

  if (!isStockCount) return null;

  const handleScannerChange = (e) => {
    const val = e.target.value;
    setScannerInput(val);
    
    // Instant match on QR code or Lot number
    const matched = stockCountList.find(l => l.qr === val.trim() || l.lot === val.trim());
    if (matched) {
      setHighlightedLotId(matched.lotId);
      setScannerInput(''); // Reset field
      setTimeout(() => {
        const inputEl = inputRefs.current[matched.lotId];
        if (inputEl) {
          inputEl.focus();
          inputEl.select();
        }
      }, 50);
      
      // Flash highlight
      setTimeout(() => {
        setHighlightedLotId(prev => prev === matched.lotId ? null : prev);
      }, 3000);
    }
  };

  const handleScannerKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = scannerInput.trim();
      if (!val) return;

      const matched = stockCountList.find(l => 
        l.qr.toLowerCase().includes(val.toLowerCase()) || 
        l.lot.toLowerCase().includes(val.toLowerCase())
      );

      if (matched) {
        setHighlightedLotId(matched.lotId);
        setScannerInput('');
        setTimeout(() => {
          const inputEl = inputRefs.current[matched.lotId];
          if (inputEl) {
            inputEl.focus();
            inputEl.select();
          }
        }, 50);
        setTimeout(() => {
          setHighlightedLotId(prev => prev === matched.lotId ? null : prev);
        }, 3000);
      }
    }
  };

  return (
    <div className="qms-rise" style={css(`max-width:1180px; display:flex; flex-direction:column; gap:20px;`)}>
      {/* Header Actions */}
      <div className="stock-count-header" style={css(`display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:18px 24px; box-shadow:var(--shadow-sm);`)}>
        <div style={css(`flex:1; min-width:240px;`)}>
          <h2 style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary); margin:0; display:flex; align-items:center; gap:8px;`)}>
            <span>📋</span> ตรวจนับคลังสินค้า (Stock Reconciliation)
          </h2>
          <p style={css(`font:var(--text-2xs)/1.4 var(--font-body); color:var(--text-tertiary); margin:4px 0 0 0;`)}>
            บันทึกยอดนับจริงทางกายภาพประจำสัปดาห์หรือเดือน ระบบจะคำนวณส่วนต่างและสร้างรายการปรับปรุงยอด (ADJUST) ให้อัตโนมัติ
          </p>
        </div>
        <div className="stock-count-header-buttons" style={css(`display:flex; gap:10px; flex-shrink:0;`)}>
          <button 
            onClick={() => go.inventory()}
            style={css(`padding:10px 18px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--white); color:var(--text-secondary); cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body); transition:all var(--dur-fast);`)}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
          >
            ย้อนกลับ
          </button>
          <button 
            onClick={submitStockCount}
            style={css(`padding:10px 20px; border-radius:var(--radius-md); border:none; background:var(--brand-700); color:#fff; cursor:pointer; font:var(--fw-bold) var(--text-sm)/1 var(--font-body); box-shadow:var(--glow-brand-soft); transition:all var(--dur-fast);`)}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.background = 'var(--brand-800)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = 'var(--brand-700)'; }}
          >
            บันทึกผลการตรวจนับทั้งหมด
          </button>
        </div>
      </div>

      {/* Barcode/QR Code Scanner Input Utility Bar */}
      <div className="stock-count-scanner-bar" style={css(`background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:16px 20px; display:flex; align-items:center; gap:14px; box-shadow:var(--shadow-sm);`)}>
        <span style={css(`font-size:20px;`)}>🔍</span>
        <div style={css(`flex:1;`)}>
          <input 
            type="text" 
            placeholder="สแกน QR Code / บาร์โค้ดสติกเกอร์ที่ขวด หรือพิมพ์รหัสคีย์ย่อเพื่อค้นหาแถวตรวจนับและโฟกัสทันที..." 
            value={scannerInput}
            onChange={handleScannerChange}
            onKeyDown={handleScannerKeyDown}
            style={css(`width:100%; padding:10px 14px; border:1px solid var(--border-default); border-radius:var(--radius-md); background:var(--white); color:var(--text-primary); font-size:var(--text-xs); font-family:var(--font-body); outline:none; transition:all var(--dur-fast);`)}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--brand-700)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-default)'}
          />
        </div>
      </div>

      {/* Main Table Card */}
      <div style={css(`background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); box-shadow:var(--shadow-md); overflow:hidden;`)}>
        <div className="perm-matrix-scroll" style={css(`overflow-x:auto;`)}>
          <table style={css(`width:100%; border-collapse:collapse; text-align:left;`)}>
            <thead>
              <tr style={css(`border-bottom:2px solid var(--border-subtle); background:rgba(23,36,46,0.3); font:var(--fw-semibold) var(--text-2xs)/1.4 var(--font-body); color:var(--text-tertiary);`)}>
                <th style={css(`padding:14px 18px;`)}>ชื่อน้ำยาเคมี</th>
                <th style={css(`padding:14px 18px;`)}>เลข Lot</th>
                <th style={css(`padding:14px 18px;`)}>วันหมดอายุ</th>
                <th style={css(`padding:14px 18px; text-align:right;`)}>ในระบบ</th>
                <th style={css(`padding:14px 18px; text-align:center; width:120px;`)}>นับได้จริง *</th>
                <th style={css(`padding:14px 18px; text-align:center; width:90px;`)}>ส่วนต่าง</th>
                <th style={css(`padding:14px 18px; min-width:200px;`)}>สาเหตุคลาดเคลื่อน / หมายเหตุ</th>
              </tr>
            </thead>
            <tbody>
              {stockCountList.length > 0 ? stockCountList.map((item, idx) => {
                const row = stockCountForm[item.lotId] || { qty: String(item.systemQty), reason: '' };
                const numVal = row.qty === '' ? item.systemQty : +row.qty;
                const diff = isNaN(numVal) ? 0 : numVal - item.systemQty;
                const isHighlighted = highlightedLotId === item.lotId;

                let diffBadge = <span style={css(`color:var(--text-disabled); font:var(--font-mono) var(--text-2xs);`)}>—</span>;
                if (diff > 0) {
                  diffBadge = <span style={css(`padding:3px 8px; border-radius:var(--radius-pill); background:var(--green-100); color:var(--green-700); font:var(--fw-bold) var(--text-2xs) var(--font-mono);`)}>+{diff}</span>;
                } else if (diff < 0) {
                  diffBadge = <span style={css(`padding:3px 8px; border-radius:var(--radius-pill); background:var(--red-100); color:var(--red-700); font:var(--fw-bold) var(--text-2xs) var(--font-mono);`)}>{diff}</span>;
                }

                return (
                  <tr 
                    key={idx} 
                    style={css(`border-bottom:1px solid var(--border-subtle); background:${isHighlighted ? 'rgba(43,166,198,0.15)' : diff !== 0 ? 'rgba(91,192,217,0.03)' : 'transparent'}; transition:all 0.3s ease;`)}
                  >
                    <td style={css(`padding:12px 18px; font:var(--fw-semibold) var(--text-sm)/1.4 var(--font-body); color:var(--text-primary);`)}>
                      {item.reagentName}
                    </td>
                    <td style={css(`padding:12px 18px; font:var(--font-mono) var(--text-xs)/1.2 var(--font-body); color:var(--text-secondary);`)}>
                      {item.lot}
                    </td>
                    <td style={css(`padding:12px 18px; font:var(--font-mono) var(--text-2xs)/1.2 var(--font-body); color:var(--text-secondary);`)}>
                      {item.expiry}
                    </td>
                    <td style={css(`padding:12px 18px; text-align:right; font:var(--fw-semibold) var(--text-xs) var(--font-mono); color:var(--text-secondary);`)}>
                      {item.systemQty} <span style={css(`font:var(--text-2xs) var(--font-body); color:var(--text-tertiary);`)}>{item.unit}</span>
                    </td>
                    <td style={css(`padding:8px 18px; text-align:center;`)}>
                      <input 
                        type="number"
                        min="0"
                        value={row.qty}
                        ref={el => { inputRefs.current[item.lotId] = el; }}
                        onChange={(e) => updateStockCountRow(item.lotId, e.target.value, undefined)}
                        style={css(`width:80px; padding:6px 8px; border:1px solid ${isHighlighted ? 'var(--brand-700)' : diff !== 0 ? 'var(--brand-700)' : 'var(--border-default)'}; border-radius:var(--radius-sm); background:var(--white); color:var(--text-primary); font:var(--fw-bold) var(--text-xs) var(--font-mono); text-align:center; outline:none; transition:all 0.2s;`)}
                      />
                    </td>
                    <td style={css(`padding:12px 18px; text-align:center;`)}>
                      {diffBadge}
                    </td>
                    <td style={css(`padding:8px 18px;`)}>
                      <input 
                        type="text"
                        placeholder="เช่น นับคลาดเคลื่อน / คีย์ผิด"
                        value={row.reason}
                        disabled={diff === 0}
                        onChange={(e) => updateStockCountRow(item.lotId, undefined, e.target.value)}
                        style={css(`width:100%; padding:6px 10px; border:1px solid var(--border-default); border-radius:var(--radius-sm); background:${diff === 0 ? 'var(--surface-sunken)' : 'var(--white)'}; color:var(--text-primary); font-size:var(--text-xs); font-family:var(--font-body); outline:none;`)}
                      />
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="7" style={css(`padding:32px; text-align:center; color:var(--text-tertiary); font:var(--text-sm)/1.4 var(--font-body);`)}>
                    ไม่มี Lot น้ำยาที่พร้อมใช้งานเพื่อทำการตรวจนับคลังในขณะนี้
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
