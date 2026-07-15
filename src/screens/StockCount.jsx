import React from 'react';
import { css } from '../css.js';
import { Html5Qrcode } from 'html5-qrcode';

export function StockCount({ v }) {
  const {
    isStockCount, stockCountList, stockCountForm, updateStockCountRow,
    submitStockCount, go, ic
  } = v;

  const [scannerInput, setScannerInput] = React.useState('');
  const [highlightedLotId, setHighlightedLotId] = React.useState(null);
  const inputRefs = React.useRef({});
  
  const [showCamera, setShowCamera] = React.useState(false);
  const [cameraReady, setCameraReady] = React.useState(false);
  const [cameraError, setCameraError] = React.useState(null);
  const [justScanned, setJustScanned] = React.useState(false);

  const html5QrCodeRef = React.useRef(null);

  React.useEffect(() => {
    let active = true;
    if (!showCamera) return undefined;

    setCameraError(null);
    setCameraReady(false);

    const html5QrCode = new Html5Qrcode("qr-reader-stock", {
      verbose: false,
      experimentalFeatures: { useBarCodeDetectorIfSupported: true },
    });
    html5QrCodeRef.current = html5QrCode;

    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 30, // Higher frame-rate for faster scan reactions
        aspectRatio: 1.0,
        qrbox: (w, h) => {
          // Larger scanning viewfinder box (85% instead of 70%) to let camera focus naturally from a distance
          const s = Math.floor(Math.min(w, h) * 0.85);
          return { width: s, height: s };
        }
      },
      (msg) => {
        const code = msg.trim();
        const matched = stockCountList.find(l => l.qr === code || l.lot === code);
        if (matched) {
          if (navigator.vibrate) navigator.vibrate([150]);
          setJustScanned(true);
          setHighlightedLotId(matched.lotId);
          setScannerInput('');
          
          setTimeout(() => {
            if (active) {
              setShowCamera(false);
              setJustScanned(false);
              const inputEl = inputRefs.current[matched.lotId];
              if (inputEl) {
                inputEl.focus();
                inputEl.select();
              }
            }
          }, 550);

          setTimeout(() => {
            setHighlightedLotId(prev => prev === matched.lotId ? null : prev);
          }, 3500);
        } else {
          const matchedSub = stockCountList.find(l => 
            l.qr.toLowerCase().includes(code.toLowerCase()) || 
            l.lot.toLowerCase().includes(code.toLowerCase())
          );
          if (matchedSub) {
            if (navigator.vibrate) navigator.vibrate([150]);
            setJustScanned(true);
            setHighlightedLotId(matchedSub.lotId);
            setScannerInput('');

            setTimeout(() => {
              if (active) {
                setShowCamera(false);
                setJustScanned(false);
                const inputEl = inputRefs.current[matchedSub.lotId];
                if (inputEl) {
                  inputEl.focus();
                  inputEl.select();
                }
              }
            }, 550);

            setTimeout(() => {
              setHighlightedLotId(prev => prev === matchedSub.lotId ? null : prev);
            }, 3500);
          } else {
            if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
            setCameraError('ไม่พบรายการน้ำยาหรือ Lot นี้ในคิวตรวจนับ');
            setTimeout(() => {
              if (active) {
                setCameraError(null);
              }
            }, 3000);
          }
        }
      },
      () => {}
    ).then(() => {
      if (active) setCameraReady(true);
      // Safely apply advanced browser camera autofocus/zoom constraints
      try {
        const videoElem = document.querySelector("#qr-reader-stock video");
        if (videoElem && videoElem.srcObject) {
          const tracks = videoElem.srcObject.getVideoTracks();
          if (tracks && tracks.length > 0) {
            const track = tracks[0];
            const capabilities = typeof track.getCapabilities === "function" ? track.getCapabilities() : {};
            const advanced = {};

            // Attempt continuous autofocus
            if (capabilities.focusMode && capabilities.focusMode.includes("continuous")) {
              advanced.focusMode = "continuous";
            } else if (capabilities.focusMode && capabilities.focusMode.includes("macro")) {
              advanced.focusMode = "macro";
            }

            // If zoom is supported, apply a slight 1.25x zoom to aid focusing on small tubes
            if (capabilities.zoom) {
              const minZoom = capabilities.zoom.min || 1;
              const maxZoom = capabilities.zoom.max || 1;
              const targetZoom = Math.min(minZoom * 1.25, maxZoom);
              advanced.zoom = targetZoom;
            }

            if (Object.keys(advanced).length > 0) {
              track.applyConstraints({ advanced: [advanced] }).catch(err => {
                console.warn("Could not apply advanced video constraints:", err);
              });
            }
          }
        }
      } catch (e) {
        console.warn("Error setting up video constraints:", e);
      }
    }).catch((err) => {
      if (active) {
        console.error('Camera start error:', err);
        setCameraError('ไม่สามารถเปิดกล้องได้ (โปรดอนุญาตสิทธิ์กล้องในเบราว์เซอร์)');
      }
    });

    return () => {
      active = false;
      const scanner = html5QrCodeRef.current;
      if (scanner) {
        html5QrCodeRef.current = null;
        if (scanner.isScanning) {
          scanner.stop().catch((e) => console.log('Failed to stop camera:', e));
        }
      }
    };
  }, [showCamera, stockCountList]);

  const cornerStyle = (top, left, right, bottom, scanned) => css(`
    position: absolute;
    width: 26px;
    height: 26px;
    border-color: ${scanned ? 'var(--green-600)' : 'var(--brand-500)'};
    border-style: solid;
    border-width: ${top ? '3px' : '0'} ${right ? '3px' : '0'} ${bottom ? '3px' : '0'} ${left ? '3px' : '0'};
    border-top-left-radius: ${top && left ? '8px' : '0'};
    border-top-right-radius: ${top && right ? '8px' : '0'};
    border-bottom-left-radius: ${bottom && left ? '8px' : '0'};
    border-bottom-right-radius: ${bottom && right ? '8px' : '0'};
    top: ${top ? '14px' : 'auto'};
    bottom: ${bottom ? '14px' : 'auto'};
    left: ${left ? '14px' : 'auto'};
    right: ${right ? '14px' : 'auto'};
    filter: drop-shadow(0 0 6px ${scanned ? 'rgba(56,182,115,.7)' : 'rgba(91,192,217,.65)'});
    transition: border-color var(--dur-base) var(--ease-out), filter var(--dur-base) var(--ease-out);
    pointer-events: none;
  `);

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
        <button
          type="button"
          onClick={() => setShowCamera(true)}
          style={css(`display:flex; align-items:center; gap:6px; padding:10px 16px; border-radius:var(--radius-md); border:none; background:var(--brand-700); color:#fff; cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body); box-shadow:var(--glow-brand-soft); transition:all var(--dur-fast); height:38px; flex-shrink:0;`)}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-800)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--brand-700)'; e.currentTarget.style.transform = 'none'; }}
        >
          <span style={css(`display:inline-flex; align-items:center; justify-content:center;`)}>{ic.qr}</span>
          <span>สแกน QR</span>
        </button>
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

      {/* Camera scan popup — only mounted (and camera only started) when opened */}
      {showCamera && (
        <div
          className="ov-in"
          onClick={() => setShowCamera(false)}
          style={css(`position:fixed; inset:0; background:rgba(8,12,18,.78); backdrop-filter:blur(3px); -webkit-backdrop-filter:blur(3px); z-index:90; display:grid; place-items:center; padding:20px; --brand-700:#7AA2C4; --brand-800:#93b9e1; --brand-600:#7AA2C4; --brand-500:#93b9e1; --brand-400:#a9c7ee; --brand-100:rgba(122,162,196,0.22); --brand-50:rgba(122,162,196,0.12); --glow-brand-soft:0 6px 18px -8px rgba(122,162,196,0.5);`)}
        >
          <style>{`
            @keyframes scanline-sweep {
              0%   { top: 6%; opacity: 0; }
              10%  { opacity: 1; }
              90%  { opacity: 1; }
              100% { top: 94%; opacity: 0; }
            }
            @keyframes scan-ring-pulse {
              0%, 100% { box-shadow: 0 0 0 0 rgba(91,192,217,.45); }
              50%      { box-shadow: 0 0 0 6px rgba(91,192,217,0); }
            }
            @keyframes success-pop {
              0%   { transform: scale(.6); opacity: 0; }
              60%  { transform: scale(1.08); opacity: 1; }
              100% { transform: scale(1); opacity: 1; }
            }
            @keyframes spin {
              from { transform: rotate(0deg); }
              to   { transform: rotate(360deg); }
            }
            @media (prefers-reduced-motion: reduce) {
              .qr-scanline, .qr-icon-badge, .qr-success-badge { animation: none !important; }
            }
          `}</style>
          <div onClick={(e) => e.stopPropagation()} style={css(`width:min(400px,94vw); background:var(--surface-card); border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); border:2px solid #b2d1da; overflow:hidden; --surface-card:#e0ecf0; --text-primary:#10222a; --text-secondary:#2d444e; --text-tertiary:#526d79; --border-subtle:#b2d1da; --border-default:#b2d1da; --border-strong:#b2d1da; --slate-50:#d1e2e6; --slate-100:#b2d1da; --slate-200:#9abdc6; --surface-sunken:#d1e2e6;`)}>
            <div style={css(`padding:16px 18px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:11px; background:var(--surface-sunken);`)}>
              <span
                className="qr-icon-badge"
                style={css(`width:32px; height:32px; border-radius:var(--radius-md); background:var(--brand-50); color:var(--brand-700); display:grid; place-items:center; flex-shrink:0; animation:${cameraReady && !cameraError ? 'scan-ring-pulse 2s infinite ease-out' : 'none'};`)}
              >
                {ic.qr}
              </span>
              <div style={css(`flex:1;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-sm)/1.2 var(--font-display); color:var(--text-primary);`)}>สแกน QR Code ตรวจนับคลัง</div>
                <div style={css(`font:var(--text-3xs)/1.3 var(--font-body); color:var(--text-tertiary); margin-top:1px;`)}>
                  {justScanned ? 'พบข้อมูลแล้ว' : cameraError ? cameraError : cameraReady ? 'กำลังค้นหา QR Code…' : 'กำลังเปิดกล้อง…'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCamera(false)}
                style={css(`border:none; background:var(--slate-100); cursor:pointer; padding:6px; border-radius:var(--radius-sm); color:var(--text-secondary); display:grid; place-items:center; transition:all var(--dur-fast);`)}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--slate-200)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--slate-100)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                {ic.close}
              </button>
            </div>

            <div style={css(`padding:18px;`)}>
              <div style={css(`position:relative; width:100%; aspect-ratio:1/1; background:#050a10; border:1px solid var(--border-strong); border-radius:var(--radius-lg); overflow:hidden; display:flex; justify-content:center; align-items:center; box-shadow:inset 0 0 40px rgba(0,0,0,.5);`)}>
                <div id="qr-reader-stock" style={{ width: '100%', height: '100%', opacity: cameraReady ? 1 : 0, transition: 'opacity .3s ease' }}></div>

                {/* Vignette frame */}
                <div style={css(`position:absolute; inset:0; box-shadow:inset 0 0 60px 18px rgba(0,0,0,.55); pointer-events:none;`)} />

                <div style={cornerStyle(true, true, false, false, justScanned)} />
                <div style={cornerStyle(true, false, true, false, justScanned)} />
                <div style={cornerStyle(false, true, false, true, justScanned)} />
                <div style={cornerStyle(false, false, true, true, justScanned)} />

                {cameraReady && !cameraError && !justScanned && (
                  <div
                    className="qr-scanline"
                    style={{
                      position: 'absolute', left: '16%', right: '16%', height: '2.5px',
                      background: 'linear-gradient(90deg, transparent, var(--brand-500) 20%, var(--brand-400) 50%, var(--brand-500) 80%, transparent)',
                      boxShadow: '0 0 10px 1px rgba(91,192,217,.8)',
                      animation: 'scanline-sweep 2.4s infinite cubic-bezier(0.45,0,0.55,1)',
                      pointerEvents: 'none', zIndex: 10,
                    }}
                  />
                )}

                {/* Loading state */}
                {!cameraReady && !cameraError && (
                  <div style={css(`position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; z-index:5;`)}>
                    <span style={css(`width:34px; height:34px; border-radius:50%; border:3px solid var(--slate-700); border-top-color:var(--brand-500); animation:spin .8s linear infinite;`)} />
                    <div style={css(`font:var(--text-2xs)/1.4 var(--font-body); color:var(--slate-400);`)}>กำลังเปิดกล้อง…</div>
                  </div>
                )}

                {/* Success flash */}
                {justScanned && (
                  <div style={css(`position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; background:rgba(15,30,22,.55); z-index:11;`)}>
                    <span
                      className="qr-success-badge"
                      style={css(`width:52px; height:52px; border-radius:50%; background:var(--green-600); color:#fff; display:grid; place-items:center; box-shadow:0 0 24px rgba(56,182,115,.65); animation:success-pop .35s var(--ease-out) both;`)}
                    >
                      {ic.check}
                    </span>
                    <div style={css(`font:var(--fw-bold) var(--text-sm)/1.2 var(--font-body); color:#fff;`)}>สแกนสำเร็จ</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
