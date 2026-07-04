import React from 'react';
import { css } from '../css.js';
import { Input } from '../components/Input.jsx';
import { Html5Qrcode } from 'html5-qrcode';

export function IssueModal({ v }) {
  const {
    stop, ic, modalIssue, closeModal,
    iform, ifQty, ifRef, submitIssue,
    issuePlanRows, issueShort, issueHasPlan, issueUnit,
    scanQRCode, unlinkLot, selectReagentForIssue,
    activeLotsList, reagentsList, issueOnHand,
    ifSearchInput,
  } = v;

  const [showDropdown, setShowDropdown] = React.useState(false);

  React.useEffect(() => {
    const handleOutsideClick = () => setShowDropdown(false);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Camera is off by default — it only starts when the user opens the scan popup.
  const [showCamera, setShowCamera] = React.useState(false);
  const [cameraError, setCameraError] = React.useState(null);
  const [cameraReady, setCameraReady] = React.useState(false);
  const [justScanned, setJustScanned] = React.useState(false);
  const [manualCode, setManualCode] = React.useState('');
  const html5QrCodeRef = React.useRef(null);

  // Keep latest handler + form in refs so the scanner's success callback (created
  // once when the camera starts) always reads current values, not a stale snapshot.
  const scanRef = React.useRef(scanQRCode);
  scanRef.current = scanQRCode;
  const lotIdRef = React.useRef(iform.lotId);
  lotIdRef.current = iform.lotId;

  // Start/stop the live camera whenever the scan popup is opened/closed.
  React.useEffect(() => {
    if (!showCamera) return undefined;
    let active = true;
    setCameraError(null);
    setCameraReady(false);
    setJustScanned(false);

    const timer = setTimeout(() => {
      if (!active) return;
      try {
        const html5QrCode = new Html5Qrcode("qr-reader");
        html5QrCodeRef.current = html5QrCode;
        html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            aspectRatio: 1.0,
            disableFlip: true,
            qrbox: (w, h) => {
              const s = Math.floor(Math.min(w, h) * 0.8);
              return { width: s, height: s };
            }
          },
          (msg) => {
            if (lotIdRef.current) return;
            const linked = scanRef.current(msg);
            if (linked) {
              if (navigator.vibrate) navigator.vibrate(100);
              setJustScanned(true); // brief green success flash before the popup closes
              setTimeout(() => { if (active) setShowCamera(false); }, 550);
            }
          },
          () => {}
        ).then(() => {
          if (active) setCameraReady(true);
        }).catch((err) => {
          if (active) {
            console.error('Camera start error:', err);
            setCameraError('ไม่สามารถเปิดกล้องได้ (โปรดอนุญาตสิทธิ์กล้องในเบราว์เซอร์)');
          }
        });
      } catch (e) {
        if (active) setCameraError('ไม่สามารถเริ่มต้นระบบกล้องได้');
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
      const scanner = html5QrCodeRef.current;
      if (scanner) {
        if (scanner.isScanning) scanner.stop().catch((e) => console.log('Failed to stop camera:', e));
        html5QrCodeRef.current = null;
      }
    };
  }, [showCamera]);

  // Close the camera popup automatically if the whole issue modal closes.
  React.useEffect(() => {
    if (!modalIssue && showCamera) setShowCamera(false);
  }, [modalIssue, showCamera]);

  if (!modalIssue) return null;

  const query = (iform.searchInput || '').trim().toLowerCase();
  const filteredReagents = reagentsList.filter(r => 
    r.code.toLowerCase().includes(query) || 
    r.th.toLowerCase().includes(query) || 
    r.en.toLowerCase().includes(query)
  );

  const selectedReagentObj = reagentsList.find(r => r.id === +iform.rid);
  const linkedLotObj = activeLotsList.find(l => l.id === +iform.lotId);

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

  const localStyle = `
    .modal-footer-responsive {
      padding: 14px 22px;
      border-top: 1px solid var(--border-subtle);
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      background: var(--slate-50);
    }
    @media (max-width: 768px) {
      .modal-footer-responsive {
        flex-direction: column !important;
        gap: 8px !important;
        padding: 16px !important;
      }
      .modal-footer-responsive button {
        width: 100% !important;
        padding: 12px 18px !important;
        font-size: 15px !important;
      }
    }
  `;

  return (
    <>
      <style>{localStyle}</style>
      <div className="ov-in" onClick={closeModal} style={css(`position:fixed; inset:0; background:rgba(24,27,42,.46); z-index:50; display:grid; place-items:center; padding:24px;`)}>
        <div className="tt-in theme-light-scope" onClick={stop} style={css(`width:min(720px,96vw); max-height:92vh; overflow-y:auto; background:var(--surface-card); border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); border:1px solid var(--border-subtle);`)}>
          
          {/* Header */}
          <div style={css(`padding:18px 22px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:11px;`)}>
            <span style={css(`width:34px; height:34px; border-radius:var(--radius-md); background:var(--accent-50); color:var(--accent-600); display:grid; place-items:center;`)}>
              {ic.issue}
            </span>
            <div style={css(`flex:1;`)}>
              <div style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary);`)}>เบิกจ่ายน้ำยาห้องปฏิบัติการ</div>
              <div style={css(`font:var(--text-2xs)/1.3 var(--font-body); color:var(--text-tertiary);`)}>ทำรายการเบิกจ่ายสารเคมีและน้ำยาโดยอิงเกณฑ์หมดอายุก่อน–เบิกก่อน</div>
            </div>
            <button onClick={closeModal} style={css(`border:none; background:var(--slate-100); cursor:pointer; padding:6px; border-radius:var(--radius-sm); color:var(--text-secondary); display:grid; place-items:center;`)}>
              {ic.close}
            </button>
          </div>

          {/* Form Body */}
          <div style={css(`padding:20px 22px; display:flex; flex-direction:column; gap:16px;`)}>
            
            {/* 1. Search Reagent (Always at the TOP) */}
            <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
              <Input 
                label="ค้นหาน้ำยาที่ต้องการเบิก (พิมพ์ชื่อหรือรหัส)" 
                required={true}
                placeholder="พิมพ์เพื่อค้นหา เช่น Glucose, CBC, Anti-HIV..." 
                value={iform.searchInput || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  ifSearchInput(val);
                  setShowDropdown(true);
                  if (!val) {
                    selectReagentForIssue('');
                  }
                }}
                onFocus={() => setShowDropdown(true)}
                suffix={
                  <span style={css(`color:var(--text-tertiary); display:grid; place-items:center; margin-right:8px;`)}>
                    {ic.search}
                  </span>
                }
              />
              
              {showDropdown && query && filteredReagents.length > 0 && (
                <div style={css(`position:absolute; top:70px; left:0; right:0; background:var(--surface-card); border:1px solid var(--border-strong); border-radius:var(--radius-md); box-shadow:var(--shadow-lg); z-index:100; max-height:220px; overflow-y:auto;`)}>
                  {filteredReagents.map(r => {
                    const totalStock = activeLotsList.filter(l => l.rid === r.id).reduce((sum, l) => sum + l.qty, 0);
                    return (
                      <div 
                        key={r.id} 
                        onClick={() => {
                          selectReagentForIssue(r.id);
                          setShowDropdown(false);
                        }}
                        style={css(`padding:10px 14px; cursor:pointer; font:var(--text-sm)/1.3 var(--font-body); color:var(--text-primary); border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; transition:background var(--dur-fast);`)}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--slate-50)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div>
                          <div style={css(`font-weight:600; color:var(--text-primary);`)}>{r.th}</div>
                          <div style={css(`font:var(--text-2xs)/1 var(--font-mono); color:var(--text-tertiary); margin-top:2px;`)}>{r.en}</div>
                        </div>
                        <div style={css(`font:var(--fw-semibold) var(--text-xs)/1 var(--font-mono); color:var(--brand-800);`)}>
                          คงเหลือ {totalStock} {r.unit}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reagent Info Display (if selected manually) */}
            {selectedReagentObj && (
              <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:10px 14px; display:flex; align-items:center; justify-content:space-between; font:var(--text-xs)/1.3 var(--font-body); margin-top:-6px;`)}>
                <div>
                  <span style={css(`font-weight:600; color:var(--text-primary);`)}>{selectedReagentObj.th}</span>
                </div>
                <div style={css(`font-family:var(--font-mono); font-weight:600; color:var(--brand-800);`)}>
                  คงเหลือรวมในคลัง: {issueOnHand} {selectedReagentObj.unit}
                </div>
              </div>
            )}

            {/* Direct lot picker — works without the camera (FEFO order) */}
            {selectedReagentObj && (() => {
              const lots = activeLotsList
                .filter(l => l.rid === selectedReagentObj.id)
                .slice()
                .sort((a, b) => a.expiry.localeCompare(b.expiry));
              if (lots.length === 0) return null;
              return (
                <div style={css(`display:flex; flex-direction:column; gap:8px; margin-top:-4px;`)}>
                  <div style={css(`font:var(--fw-medium) var(--text-2xs)/1.3 var(--font-body); color:var(--text-secondary);`)}>
                    เลือก Lot ที่ต้องการเบิก (หรือปล่อยว่างเพื่อจ่ายแบบหมดอายุก่อน–เบิกก่อนอัตโนมัติ)
                  </div>
                  <div style={css(`display:flex; flex-wrap:wrap; gap:8px;`)}>
                    {lots.map((l, i) => {
                      const linked = String(l.id) === String(iform.lotId);
                      return (
                        <button
                          key={l.id}
                          type="button"
                          onClick={() => scanQRCode(l.qr)}
                          style={css(`display:flex; flex-direction:column; align-items:flex-start; gap:2px; padding:8px 12px; border-radius:var(--radius-md); cursor:pointer; text-align:left; border:1px solid ${linked ? 'var(--green-700)' : 'var(--border-default)'}; background:${linked ? 'rgba(56,182,115,.12)' : 'var(--white)'}; transition:all var(--dur-fast);`)}
                          onMouseEnter={(e) => { if (!linked) e.currentTarget.style.borderColor = 'var(--border-brand)'; }}
                          onMouseLeave={(e) => { if (!linked) e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                        >
                          <span style={css(`font:var(--fw-bold) var(--text-xs)/1 var(--font-mono); color:var(--text-primary);`)}>
                            Lot {l.lot}{i === 0 ? ' · หมดอายุก่อน–เบิกก่อน ถัดไป' : ''}
                          </span>
                          <span style={css(`font:var(--text-2xs)/1.2 var(--font-body); color:var(--text-tertiary);`)}>
                            เหลือ {l.qty} {selectedReagentObj.unit} · หมดอายุ {l.expiry}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* 2. Scan / link a specific lot (camera opens as a popup on demand) */}
            <div style={css(`display:flex; flex-direction:column; gap:12px; border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:16px; background:var(--surface-sunken);`)}>
              <style>{`
                @keyframes pulse-qr {
                  0% { box-shadow: 0 0 5px rgba(95, 212, 154, 0.2); }
                  50% { box-shadow: 0 0 15px rgba(95, 212, 154, 0.6); }
                  100% { box-shadow: 0 0 5px rgba(95, 212, 154, 0.2); }
                }
              `}</style>

              {/* Linked Lot Status */}
              {iform.lotId ? (
                <div style={{
                  background: 'rgba(56,182,115,.12)',
                  border: '1px solid var(--green-700)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  animation: 'pulse-qr 2s infinite ease-in-out'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ display: 'grid', placeItems: 'center', color: 'var(--green-700)' }}>
                      {ic.shield || ic.check}
                    </span>
                    <div style={{ font: 'var(--text-sm)/1.3 var(--font-body)' }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--green-700)' }}>สำเร็จ!</div>
                      <div style={{ font: 'var(--text-2xs)/1 var(--font-mono)', color: 'var(--text-secondary)', marginTop: 2 }}>
                        น้ำยา: <strong style={{ color: 'var(--text-primary)' }}>{selectedReagentObj ? selectedReagentObj.th : ''}</strong> · Lot: <strong style={{ color: 'var(--text-primary)' }}>{linkedLotObj ? linkedLotObj.lot : ''}</strong> (คงเหลือ {linkedLotObj ? linkedLotObj.qty : 0} {selectedReagentObj ? selectedReagentObj.unit : ''})
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={unlinkLot}
                    style={css(`background:transparent; border:1px solid var(--border-default); border-radius:var(--radius-sm); padding:4px 8px; font:var(--fw-medium) var(--text-2xs)/1.2 var(--font-body); color:var(--text-secondary); cursor:pointer; white-space:nowrap; flex-shrink:0;`)}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--red-700)'; e.currentTarget.style.color = 'var(--red-700)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    ยกเลิก
                  </button>
                </div>
              ) : null}

              {/* Open-camera button (compact — camera pops up only when tapped) */}
              <button
                type="button"
                onClick={() => setShowCamera(true)}
                style={css(`display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:11px; border-radius:var(--radius-md); border:1px dashed var(--border-strong); background:var(--white); color:var(--brand-700); cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body); transition:all var(--dur-fast);`)}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-brand)'; e.currentTarget.style.background = 'var(--brand-50)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'var(--white)'; }}
              >
                <span style={css(`display:grid; place-items:center;`)}>{ic.qr}</span>
                สแกน QR Code ด้วยกล้อง
              </button>

              {/* Manual code fallback — type the lot number or QR code by hand */}
              <div style={css(`display:grid; grid-template-columns:1fr auto; gap:8px; align-items:flex-end;`)}>
                <Input
                  label="หรือพิมพ์รหัส Lot / QR Code เอง"
                  placeholder="เช่น G2407A หรือ QR-G2407A"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && manualCode.trim()) { scanQRCode(manualCode); setManualCode(''); } }}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => { if (manualCode.trim()) { scanQRCode(manualCode); setManualCode(''); } }}
                  style={css(`background:var(--brand-700); color:#fff; border:none; border-radius:var(--radius-md); padding:0 14px; height:40px; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body); cursor:pointer; display:flex; align-items:center; white-space:nowrap; flex-shrink:0;`)}
                >
                  ยืนยัน
                </button>
              </div>
            </div>

            {/* 3. Withdraw Quantity */}
            <div>
              <Input 
                label="จำนวนที่เบิก" 
                type="number" 
                required={true} 
                placeholder="ป้อนจำนวนตัวเลข เช่น 1" 
                value={iform.qty} 
                onChange={ifQty} 
              />
            </div>

            {/* FEFO Plan details */}
            {issueHasPlan ? (
              <div style={css(`background:var(--brand-50); border:1px solid var(--brand-100); border-radius:var(--radius-md); padding:14px 16px; margin-top:4px;`)}>
                <div style={css(`font:var(--fw-semibold) var(--text-xs)/1.4 var(--font-body); color:var(--brand-800); margin-bottom:8px;`)}>
                  {iform.lotId ? 'จัดสรรการเบิกจาก Lot เจาะจงที่สแกนสำเร็จ' : 'การจัดสรรล็อตที่จะทำรายการเบิกจ่าย (เรียงตามลำดับอายุสั้นสุด)'}
                </div>
                {issuePlanRows.map((p, pI) => (
                  <div key={pI} style={css(`display:flex; align-items:center; gap:12px; padding:8px 0; border-bottom:1px solid var(--brand-100); font:var(--text-sm)/1.3 var(--font-body);`)}>
                    <span style={css(`font:var(--fw-bold) var(--text-sm)/1 var(--font-mono); color:var(--brand-800);`)}>Lot {p.lot}</span>
                    <span style={css(`font:var(--text-2xs)/1 var(--font-mono); color:${p.col}; font-weight:600;`)}>หมดอายุ {p.expiry} · {p.dayLabel}</span>
                    <span style={css(`flex:1;`)} />
                    <span style={css(`font:var(--fw-bold) var(--text-sm)/1 var(--font-mono); color:var(--accent-700);`)}>−{p.take} {issueUnit}</span>
                  </div>
                ))}
              </div>
            ) : null}
            
            {issueShort ? (
              <div style={css(`background:var(--red-100); border:1px solid var(--red-100); border-radius:var(--radius-md); padding:11px 14px; font:var(--fw-medium) var(--text-xs)/1.5 var(--font-body); color:var(--red-700); margin-top:4px;`)}>
                สินค้าในคลังไม่เพียงพอสำหรับเบิกจ่าย — ขาดอีก {issueShort} {issueUnit}
              </div>
            ) : null}
          </div>

          {/* Footer Buttons */}
          <div className="modal-footer-responsive">
            <button 
              onClick={closeModal} 
              style={css(`padding:8px 16px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--white); color:var(--text-secondary); cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body); transition:all var(--dur-fast);`)}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--slate-100)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              ยกเลิก
            </button>
            <button 
              onClick={submitIssue} 
              style={css(`padding:8px 16px; border-radius:var(--radius-md); border:none; background:var(--accent-600); color:#fff; cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body); box-shadow:var(--glow-accent); transition:all var(--dur-fast);`)}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(78,124,176,0.35)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--glow-accent)'; }}
            >
              ยืนยันเบิกจ่าย
            </button>
          </div>
        </div>
      </div>

      {/* Camera scan popup — only mounted (and camera only started) when opened */}
      {showCamera && (
        <div
          className="ov-in"
          onClick={() => setShowCamera(false)}
          style={css(`position:fixed; inset:0; background:rgba(8,12,18,.78); backdrop-filter:blur(3px); -webkit-backdrop-filter:blur(3px); z-index:60; display:grid; place-items:center; padding:20px;`)}
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
          <div onClick={stop} style={css(`width:min(400px,94vw); background:var(--surface-card); border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); border:1px solid var(--border-subtle); overflow:hidden;`)}>
            <div style={css(`padding:16px 18px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:11px; background:var(--surface-sunken);`)}>
              <span
                className="qr-icon-badge"
                style={css(`width:32px; height:32px; border-radius:var(--radius-md); background:var(--brand-50); color:var(--brand-700); display:grid; place-items:center; flex-shrink:0; animation:${cameraReady && !cameraError ? 'scan-ring-pulse 2s infinite ease-out' : 'none'};`)}
              >
                {ic.qr}
              </span>
              <div style={css(`flex:1;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-sm)/1.2 var(--font-display); color:var(--text-primary);`)}>สแกน QR Code น้ำยา</div>
                <div style={css(`font:var(--text-3xs)/1.3 var(--font-body); color:var(--text-tertiary); margin-top:1px;`)}>
                  {justScanned ? 'พบข้อมูลแล้ว' : cameraError ? 'เปิดกล้องไม่สำเร็จ' : cameraReady ? 'กำลังค้นหา QR Code…' : 'กำลังเปิดกล้อง…'}
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
                <div id="qr-reader" style={{ width: '100%', height: '100%', opacity: cameraReady ? 1 : 0, transition: 'opacity .3s ease' }}></div>

                {/* Darkened vignette frame focusing attention on the center scan target */}
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

                {/* Loading state while the camera is still warming up */}
                {!cameraReady && !cameraError && (
                  <div style={css(`position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; z-index:5;`)}>
                    <span style={css(`width:34px; height:34px; border-radius:50%; border:3px solid var(--slate-700); border-top-color:var(--brand-500); animation:spin .8s linear infinite;`)} />
                    <div style={css(`font:var(--text-2xs)/1.4 var(--font-body); color:var(--slate-400);`)}>กำลังเปิดกล้อง…</div>
                  </div>
                )}

                {/* Success flash — a brief confirmation before the popup auto-closes */}
                {justScanned && (
                  <div style={css(`position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; background:rgba(15,30,22,.55); z-index:11;`)}>
                    <span
                      className="qr-success-badge"
                      style={css(`width:52px; height:52px; border-radius:50%; background:var(--green-600); color:#fff; display:grid; place-items:center; box-shadow:0 0 24px rgba(56,182,115,.65); animation:success-pop .35s var(--ease-out) both;`)}
                    >
                      {ic.check}
                    </span>
                    <div style={css(`font:var(--fw-bold) var(--text-sm)/1.2 var(--font-body); color:#fff;`)}>เชื่อมโยงล็อตสำเร็จ</div>
                  </div>
                )}

                {cameraError && (
                  <div style={css(`position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; align-items:center; background:rgba(5,10,16,.92); z-index:10; padding:18px; text-align:center; gap:10px;`)}>
                    <div style={css(`color:var(--red-700); font-weight:600; font:var(--text-xs)/1.5 var(--font-body);`)}>⚠️ {cameraError}</div>
                    <button
                      type="button"
                      onClick={() => { setShowCamera(false); setTimeout(() => setShowCamera(true), 60); }}
                      style={css(`padding:7px 14px; border-radius:var(--radius-sm); border:none; background:var(--brand-700); color:#fff; cursor:pointer; font:var(--fw-semibold) var(--text-2xs)/1 var(--font-body);`)}
                    >
                      ลองเปิดกล้องอีกครั้ง
                    </button>
                  </div>
                )}
              </div>
              <div style={css(`margin-top:14px; text-align:center; font:var(--text-2xs)/1.4 var(--font-body); color:var(--text-tertiary);`)}>
                เล็ง QR Code บนสติกเกอร์ให้อยู่ในกรอบ · หากสแกนไม่ติดให้ปิดแล้วพิมพ์รหัส Lot เอง
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
