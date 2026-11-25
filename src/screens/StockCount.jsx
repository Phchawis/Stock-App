import React from 'react';
import { css } from '../css.js';
import { buddhistYearFix } from '../domain/stock.js';

export function StockCount({ v }) {
  const {
    isStockCount, stockCountList, stockCountForm, updateStockCountRow,
    submitStockCount, go, ic, canReceive, openCountReceive, findLotByCode,
    canManage, lotFixRequests, correctLotNumber, reportLotFix, reagentLots, findNearLots,
    kindOptsForCount,
  } = v;

  const [scannerInput, setScannerInput] = React.useState('');
  // The lot whose number is being corrected from its label, or null.
  const [fixing, setFixing] = React.useState(null);
  const openFix = (item, newLot = '') => {
    const row = stockCountForm[item.lotId];
    const counted = row && row.qty !== '' && !isNaN(+row.qty) ? +row.qty : item.systemQty;
    setUnknownScan(null);
    setFixing({ item, newLot, labelExpiry: item.expiry, note: '', busy: false, boxes: counted });
  };
  // Which kind is shown: 'ALL', or one of REAGENT / CONTROL / CALIBRATOR /
  // CONSUMABLE, so a count can go one shelf type at a time.
  const [kindFilter, setKindFilter] = React.useState('ALL');
  // Reagents whose lots are unfolded, by reagent id.
  const [expanded, setExpanded] = React.useState(() => new Set());
  // A scanned code that matched no lot in the count, offered as a receipt.
  const [unknownScan, setUnknownScan] = React.useState(null);
  const toggleGroup = (rid) => setExpanded(prev => {
    const next = new Set(prev);
    if (next.has(rid)) next.delete(rid); else next.add(rid);
    return next;
  });
  // Unfold the lot's reagent, then focus its count. The row only exists once
  // the reagent is unfolded, hence the wait.
  const focusLot = (lot) => {
    setUnknownScan(null);
    // A scan can land on a lot of another kind than the one being shown.
    setKindFilter(f => (f === 'ALL' || f === lot.kind ? f : lot.kind));
    setExpanded(prev => (prev.has(lot.rid) ? prev : new Set(prev).add(lot.rid)));
    setHighlightedLotId(lot.lotId);
    setTimeout(() => {
      const el = inputRefs.current[lot.lotId];
      if (el) { el.focus(); el.select(); }
    }, 80);
    setTimeout(() => setHighlightedLotId(prev => (prev === lot.lotId ? null : prev)), 3500);
  };
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

    // Loaded on demand: the scanner library is ~375KB and only matters once the
    // camera is actually opened. Keeping it out of the entry bundle speeds up
    // every page load, including the ones that never scan.
    (async () => {
    const { Html5Qrcode } = await import('html5-qrcode');
    if (!active) return;

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
        const matched = stockCountList.find(l => l.qr === code || l.lot === code)
          || stockCountList.find(l =>
            l.qr.toLowerCase().includes(code.toLowerCase()) ||
            l.lot.toLowerCase().includes(code.toLowerCase()));
        if (navigator.vibrate) navigator.vibrate(matched ? [150] : [50, 50, 50]);
        setScannerInput('');
        if (matched) setJustScanned(true);
        else setCameraError('Lot นี้ไม่อยู่ในรายการตรวจนับ');
        // Close the camera either way: a match goes to its row, a code the
        // count doesn't know becomes an offer to receive it.
        setTimeout(() => {
          if (!active) return;
          setShowCamera(false);
          setJustScanned(false);
          setCameraError(null);
          if (matched) focusLot(matched);
          else setUnknownScan(code);
        }, matched ? 550 : 900);
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

    })();

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
      setScannerInput('');
      focusLot(matched);
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
      setScannerInput('');
      if (matched) focusLot(matched);
      else setUnknownScan(val);
    }
  };

  // Per-reagent totals of what the system holds and what has been counted so
  // far, for the header row of a reagent with several lots.
  const groups = new Map();
  for (const it of stockCountList) {
    const g = groups.get(it.rid) || { lots: 0, system: 0, counted: 0 };
    const row = stockCountForm[it.lotId];
    const n = row && row.qty !== '' && !isNaN(+row.qty) ? +row.qty : it.systemQty;
    g.lots += 1; g.system += it.systemQty; g.counted += n;
    groups.set(it.rid, g);
  }

  const nearForScan = unknownScan ? findNearLots(unknownScan) : [];
  const pendingFor = (lotId) => (lotFixRequests || []).find(f => f.lotId === lotId);

  // The list arrives sorted by reagent; consecutive items of one reagent
  // make a section.
  const kindLabel = (k) => ((kindOptsForCount || []).find(o => o.value === k) || { label: k }).label;
  const shown = kindFilter === 'ALL' ? stockCountList : stockCountList.filter(it => it.kind === kindFilter);
  const sections = [];
  for (const it of shown) {
    const last = sections[sections.length - 1];
    if (last && last.rid === it.rid) last.items.push(it);
    else sections.push({ rid: it.rid, name: it.reagentName, unit: it.unit, kind: it.kind, items: [it] });
  }
  // Per kind: reagents, lots, and lots whose count differs from the system,
  // for the kind headings and the filter chips.
  const kindStats = new Map();
  for (const it of stockCountList) {
    const k = kindStats.get(it.kind) || { reagents: new Set(), lots: 0, diffs: 0 };
    const row = stockCountForm[it.lotId];
    const n = row && row.qty !== '' && !isNaN(+row.qty) ? +row.qty : it.systemQty;
    k.reagents.add(it.rid); k.lots += 1; if (n !== it.systemQty) k.diffs += 1;
    kindStats.set(it.kind, k);
  }
  const kindsPresent = (kindOptsForCount || []).filter(o => kindStats.has(o.value));

  // --text-disabled is for controls that cannot be used, which is what
  // exempts them from the contrast floor. The dash is ordinary text saying
  // "no difference" and sat at 3.4:1 in the light theme; tertiary is the token
  // for de-emphasised text that still has to be read.
  const diffBadgeFor = (diff) => {
    let badge = <span style={css(`color:var(--text-tertiary); font-family:var(--font-mono);`)}>—</span>;
    if (diff > 0) {
      badge = <span style={css(`padding:3px 8px; border-radius:var(--radius-pill); background:var(--green-100); color:var(--green-700); font:var(--fw-bold) var(--text-2xs) var(--font-mono);`)}>+{diff}</span>;
    } else if (diff < 0) {
      badge = <span style={css(`padding:3px 8px; border-radius:var(--radius-pill); background:var(--red-100); color:var(--red-700); font:var(--fw-bold) var(--text-2xs) var(--font-mono);`)}>{diff}</span>;
    }
    return badge;
  };

  // A heading row opening each kind in the table.
  const renderKindHeading = (kind) => {
    const k = kindStats.get(kind);
    return (
      <tr className="sc-kind" key={'k' + kind}>
        <td colSpan="7" style={css(`padding:14px 18px 10px; background:var(--surface-sunken); border-bottom:2px solid var(--border-default); font:var(--fw-bold) var(--text-sm)/1.3 var(--font-display); color:var(--text-primary);`)}>
          {kindLabel(kind)}
          <span style={css(`margin-left:10px; font:var(--fw-regular) var(--text-2xs)/1.3 var(--font-body); color:var(--text-secondary);`)}>
            {k.reagents.size} รายการ · {k.lots} Lot{k.diffs > 0 ? ` · ยอดไม่ตรง ${k.diffs} Lot` : ''}
          </span>
        </td>
      </tr>
    );
  };

  const renderLotRow = (item, inGroup) => {
    const row = stockCountForm[item.lotId] || { qty: String(item.systemQty), reason: '' };
    const numVal = row.qty === '' ? item.systemQty : +row.qty;
    const diff = isNaN(numVal) ? 0 : numVal - item.systemQty;
    const isHighlighted = highlightedLotId === item.lotId;
    const diffBadge = diffBadgeFor(diff);
    return (
      <tr
        key={item.lotId}
        className={inGroup ? 'sc-in-group' : undefined}
        style={css(`border-bottom:1px solid var(--border-subtle); background:${isHighlighted ? 'rgba(43,166,198,0.15)' : diff !== 0 ? 'rgba(91,192,217,0.03)' : 'transparent'}; transition:all 0.3s ease;`)}
      >
        <td data-label="ชื่อน้ำยา" style={css(`padding:12px 18px 12px ${inGroup ? 34 : 18}px; font:var(--fw-semibold) var(--text-sm)/1.4 var(--font-body); color:${inGroup ? 'var(--text-tertiary)' : 'var(--text-primary)'};`)}>
          {item.reagentName}
        </td>
        {/* Both shorthands named the family first and again at the
            end, which is not a valid `font:` — the browser dropped
            the whole declaration, so the lot number and the expiry
            date have never actually been monospace. They are the
            two values somebody reads off a label while counting, so
            the family is what matters here; it is set on its own
            rather than restoring the shorthand, which would also
            shrink these columns back down. */}
        <td data-label="Lot" style={css(`padding:12px 18px; font-family:var(--font-mono); color:var(--text-secondary);`)}>
          {item.lot}
          {pendingFor(item.lotId) ? (
            <span style={css(`display:block; margin-top:3px; font:var(--fw-semibold) var(--text-3xs)/1.3 var(--font-body); color:var(--amber-700);`)}>
              แจ้งแก้เป็น {pendingFor(item.lotId).newLot} · รออนุมัติ
            </span>
          ) : (
            <button
              type="button"
              onClick={() => openFix(item)}
              title="เลข Lot ในระบบไม่ตรงกับฉลาก"
              style={css(`display:block; margin-top:3px; padding:0; border:none; background:transparent; color:var(--text-secondary); cursor:pointer; font-family:var(--font-body); font-size:var(--text-3xs); line-height:1.3; white-space:nowrap; text-decoration:underline;`)}
            >
              แก้เลข Lot
            </button>
          )}
        </td>
        <td data-label="วันหมดอายุ" style={css(`padding:12px 18px; font-family:var(--font-mono); color:var(--text-secondary);`)}>
          {item.expiry}
        </td>
        <td data-label="จำนวนในระบบ" style={css(`padding:12px 18px; text-align:right; font:var(--fw-semibold) var(--text-xs) var(--font-mono); color:var(--text-secondary);`)}>
          {item.systemQty} <span style={css(`font:var(--text-2xs) var(--font-body); color:var(--text-tertiary);`)}>{item.unit}</span>
        </td>
        <td data-label="นับได้จริง" style={css(`padding:8px 18px; text-align:center;`)}>
          <input 
            type="number"
            aria-label={`จำนวนนับจริง Lot ${item.lot}`}
            min="0"
            value={row.qty}
            ref={el => { inputRefs.current[item.lotId] = el; }}
            onChange={(e) => updateStockCountRow(item.lotId, e.target.value, undefined)}
            style={css(`width:80px; padding:6px 8px; border:1px solid ${isHighlighted ? 'var(--brand-700)' : diff !== 0 ? 'var(--brand-700)' : 'var(--border-default)'}; border-radius:var(--radius-sm); background:var(--white); color:var(--text-primary); font:var(--fw-bold) var(--text-xs) var(--font-mono); text-align:center; outline:none; transition:all 0.2s;`)}
          />
        </td>
        <td data-label="ส่วนต่าง" style={css(`padding:12px 18px; text-align:center;`)}>
          {diffBadge}
        </td>
        <td data-label="หมายเหตุ" style={css(`padding:8px 18px;`)}>
          <input 
            type="text"
            aria-label={`หมายเหตุ Lot ${item.lot}`}
            placeholder="เช่น นับคลาดเคลื่อน / คีย์ผิด"
            value={row.reason}
            disabled={diff === 0}
            onChange={(e) => updateStockCountRow(item.lotId, undefined, e.target.value)}
            style={css(`width:100%; padding:6px 10px; border:1px solid var(--border-default); border-radius:var(--radius-sm); background:${diff === 0 ? 'var(--surface-sunken)' : 'var(--white)'}; color:var(--text-primary); font-size:var(--text-xs); font-family:var(--font-body); outline:none;`)}
          />
        </td>
      </tr>
    );
  };

  return (
    <div className="qms-rise page-shell" style={css(`gap:20px;`)}>
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

      {fixing && (
        <LotFixDialog
          fixing={fixing}
          setFixing={setFixing}
          canManage={canManage}
          reagentLots={reagentLots}
          onCorrect={async (f) => {
            setFixing(x => ({ ...x, busy: true }));
            const ok = await correctLotNumber({ lotId: f.item.lotId, newLot: f.newLot.trim(), labelExpiry: f.labelExpiry, boxes: f.boxes });
            if (ok) setFixing(null); else setFixing(x => x && ({ ...x, busy: false }));
          }}
          onReport={async (f) => {
            setFixing(x => ({ ...x, busy: true }));
            const ok = await reportLotFix({ lotId: f.item.lotId, newLot: f.newLot.trim(), labelExpiry: f.labelExpiry, note: f.note });
            if (ok) setFixing(null); else setFixing(x => x && ({ ...x, busy: false }));
          }}
        />
      )}

      {unknownScan && (
        <div role="status" style={css(`display:flex; flex-wrap:wrap; align-items:center; gap:10px 14px; padding:12px 16px; background:var(--amber-100); border:1px solid var(--amber-fill); border-radius:var(--radius-md); font:var(--text-xs)/1.5 var(--font-body); color:var(--amber-700);`)}>
          <span style={css(`flex:1; min-width:220px;`)}>
            ไม่พบ <strong style={css(`font-family:var(--font-mono);`)}>{unknownScan}</strong> ในรายการตรวจนับ
            {nearForScan.length > 0
              ? <> แต่ในระบบมี {nearForScan.map(n => <strong key={n.lotId} style={css(`font-family:var(--font-mono);`)}>{n.lot} </strong>)}({nearForScan[0].reagentName}) ซึ่งต่างกันแค่ 1 ตัวอักษร ถ้าฉลากเป็น {unknownScan.replace(/^QR-/i, '')} แสดงว่าเลขในระบบบันทึกผิด</>
              : ' ถ้าเป็นของที่อยู่บนชั้นจริง ให้รับเข้าเป็นของที่พบตอนตรวจนับ'}
          </span>
          {nearForScan.slice(0, 2).map(n => (
            <button
              key={n.lotId}
              type="button"
              onClick={() => openFix(n, unknownScan.replace(/^QR-/i, ''))}
              style={css(`padding:8px 14px; border-radius:var(--radius-md); border:none; background:var(--brand-700); color:#fff; cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body); white-space:nowrap;`)}
            >
              แก้ {n.lot} เป็นเลขตามฉลาก
            </button>
          ))}
          {canReceive && (
            <button
              type="button"
              onClick={() => {
                const known = findLotByCode(unknownScan);
                const lot = known ? known.lot : unknownScan.replace(/^QR-/i, '');
                setUnknownScan(null);
                openCountReceive({ rid: known ? known.rid : null, lot });
              }}
              style={css(`padding:8px 14px; border-radius:var(--radius-md); border:none; background:var(--brand-700); color:#fff; cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body); white-space:nowrap;`)}
            >
              รับเข้า Lot นี้
            </button>
          )}
          <button
            type="button"
            onClick={() => setUnknownScan(null)}
            style={css(`padding:8px 14px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--white); color:var(--text-secondary); cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body);`)}
          >
            ปิด
          </button>
        </div>
      )}

      {/* Count one kind at a time */}
      {kindsPresent.length > 1 && (
        <div role="group" aria-label="เลือกประเภทที่จะตรวจนับ" style={css(`display:flex; flex-wrap:wrap; gap:8px;`)}>
          {[{ value: 'ALL', label: 'ทั้งหมด', n: new Set(stockCountList.map(x => x.rid)).size, diffs: [...kindStats.values()].reduce((t, k) => t + k.diffs, 0) },
            ...kindsPresent.map(o => ({ value: o.value, label: o.label, n: kindStats.get(o.value).reagents.size, diffs: kindStats.get(o.value).diffs }))]
            .map(c => {
              const on = kindFilter === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setKindFilter(c.value)}
                  style={css(`padding:8px 14px; border-radius:var(--radius-pill); border:1px solid ${on ? 'var(--brand-700)' : 'var(--border-default)'}; background:${on ? 'var(--brand-700)' : 'var(--white)'}; color:${on ? '#fff' : 'var(--text-primary)'}; cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body); white-space:nowrap;`)}
                >
                  {c.label} <span style={css(`font-weight:400; opacity:.85;`)}>{c.n}</span>{c.diffs > 0 ? <span style={css(`font-weight:700;`)}> · ไม่ตรง {c.diffs}</span> : null}
                </button>
              );
            })}
        </div>
      )}

      {/* What the list holds, and the controls that act on all of it */}
      <div style={css(`display:flex; flex-wrap:wrap; align-items:center; gap:10px 14px;`)}>
        <span style={css(`flex:1; min-width:200px; font:var(--text-xs)/1.4 var(--font-body); color:var(--text-secondary);`)}>
          {kindFilter !== 'ALL' ? `${kindLabel(kindFilter)} · ` : ''}{sections.length} รายการ · {shown.length} Lot{sections.filter(x => x.items.length > 1).length > 0 ? ` · ${sections.filter(x => x.items.length > 1).length} น้ำยามีหลาย Lot (พับไว้ กดแสดงเพื่อนับแยก)` : ''}
        </span>
        {sections.filter(x => x.items.length > 1).length > 0 && (
          <button
            type="button"
            onClick={() => setExpanded(prev => (prev.size > 0 ? new Set() : new Set(sections.filter(x => x.items.length > 1).map(x => x.rid))))}
            style={css(`padding:8px 14px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--white); color:var(--text-primary); cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body);`)}
          >
            {expanded.size > 0 ? 'พับทุกน้ำยา' : 'แสดงทุก Lot'}
          </button>
        )}
        {canReceive && (
          <button
            type="button"
            onClick={() => openCountReceive({})}
            style={css(`padding:8px 14px; border-radius:var(--radius-md); border:1px dashed var(--border-strong); background:transparent; color:var(--text-primary); cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body);`)}
          >
            + เพิ่ม Lot ที่ไม่มีในรายการ
          </button>
        )}
      </div>

      {/* Main Table Card */}
      <div style={css(`background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); box-shadow:var(--shadow-md); overflow:hidden;`)}>
        <div className="perm-matrix-scroll" style={css(`overflow-x:auto;`)}>
          <table className="stock-count-table" style={css(`width:100%; border-collapse:collapse; text-align:left;`)}>
            <thead>
              {/* Themed, not a hardcoded dark wash. rgba(23,36,46,.3) is a dark
                  slate at 30%, which over the light theme's cream composited to
                  a muddy grey and left the tertiary-grey headings at 3:1 —
                  grey on grey. The sunken surface is the token for exactly this
                  and reads correctly in both themes. */}
              <tr style={css(`border-bottom:2px solid var(--border-subtle); background:var(--surface-sunken); font:var(--fw-semibold) var(--text-2xs)/1.4 var(--font-body); color:var(--text-secondary);`)}>
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
              {sections.length > 0 ? sections.map((sec, si) => {
                const heading = (si === 0 || sections[si - 1].kind !== sec.kind) ? renderKindHeading(sec.kind) : null;
                const rows = (() => {
                // A reagent with one lot is one row. A reagent with several
                // gets a header row carrying its totals, folded by default so
                // the page reads one line per reagent; unfolding shows a row
                // per lot, which is where the counting is entered.
                if (sec.items.length === 1) return renderLotRow(sec.items[0], false);
                const g = groups.get(sec.rid);
                const open = expanded.has(sec.rid);
                const gd = g.counted - g.system;
                return (
                  <React.Fragment key={'g' + sec.rid}>
                    <tr className="sc-group" style={css(`border-bottom:1px solid var(--border-subtle); background:${gd !== 0 ? 'var(--surface-sunken)' : 'transparent'};`)}>
                      <td style={css(`padding:12px 18px; font:var(--fw-semibold) var(--text-sm)/1.4 var(--font-body); color:var(--text-primary);`)}>
                        {sec.name}
                        <span style={css(`display:block; font:var(--fw-regular) var(--text-2xs)/1.4 var(--font-body); color:var(--text-secondary);`)}>{g.lots} Lot · นับแยกตามเลข Lot บนฉลาก</span>
                      </td>
                      <td colSpan="2" style={css(`padding:8px 18px;`)}>
                        <div style={css(`display:flex; flex-wrap:wrap; gap:8px;`)}>
                          <button
                            type="button"
                            aria-expanded={open}
                            onClick={() => toggleGroup(sec.rid)}
                            style={css(`padding:6px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-default); background:var(--white); color:var(--text-primary); cursor:pointer; font:var(--fw-semibold) var(--text-2xs)/1.2 var(--font-body); white-space:nowrap;`)}
                          >
                            {open ? `ซ่อน ${g.lots} Lot ▴` : `แสดง ${g.lots} Lot ▾`}
                          </button>
                          {canReceive && (
                            <button
                              type="button"
                              onClick={() => openCountReceive({ rid: sec.rid })}
                              style={css(`padding:6px 12px; border-radius:var(--radius-sm); border:1px dashed var(--border-strong); background:transparent; color:var(--text-secondary); cursor:pointer; font:var(--fw-semibold) var(--text-2xs)/1.2 var(--font-body); white-space:nowrap;`)}
                            >
                              + Lot ที่ไม่มีในรายการ
                            </button>
                          )}
                        </div>
                      </td>
                      <td data-label="รวมในระบบ" style={css(`padding:12px 18px; text-align:right; font:var(--fw-bold) var(--text-xs) var(--font-mono); color:var(--text-primary);`)}>
                        {g.system} <span style={css(`font:var(--text-2xs) var(--font-body); color:var(--text-tertiary);`)}>{sec.unit}</span>
                      </td>
                      <td data-label="รวมนับได้" style={css(`padding:12px 18px; text-align:center; font:var(--fw-bold) var(--text-xs) var(--font-mono); color:var(--text-primary);`)}>
                        {g.counted}
                      </td>
                      <td data-label="ส่วนต่างรวม" style={css(`padding:12px 18px; text-align:center;`)}>
                        {diffBadgeFor(gd)}
                      </td>
                      <td />
                    </tr>
                    {open && sec.items.map(item => renderLotRow(item, true))}
                  </React.Fragment>
                );
                })();
                return <React.Fragment key={'s' + sec.rid}>{heading}{rows}</React.Fragment>;
              }) : (
                <tr>
                  <td colSpan="7" style={css(`padding:32px; text-align:center; color:var(--text-tertiary); font:var(--text-sm)/1.4 var(--font-body);`)}>
                    {stockCountList.length > 0 ? `ไม่มี ${kindLabel(kindFilter)} ที่ต้องตรวจนับ` : 'ไม่มี Lot น้ำยาที่พร้อมใช้งานเพื่อทำการตรวจนับคลังในขณะนี้'}
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

// Correcting a lot number from its label. Says before anything is saved
// whether it will rename the lot or merge it into the lot that already has
// the label's number, and refuses a merge across different expiry dates.
function LotFixDialog({ fixing, setFixing, canManage, reagentLots, onCorrect, onReport }) {
  const { item, newLot, labelExpiry, note, busy } = fixing;
  const set = (k) => (e) => setFixing(f => ({ ...f, [k]: e.target.value }));
  const name = newLot.trim();
  const others = reagentLots(item.rid).filter(l => l.id !== item.lotId);
  const target = name ? others.find(l => l.lot === name) : null;
  const beYear = buddhistYearFix(labelExpiry);

  let plan = null, blocked = false;
  if (!name) { plan = 'พิมพ์เลข Lot ตามที่พิมพ์บนฉลากกล่อง'; blocked = true; }
  else if (name === item.lot) { plan = 'เลขเหมือนในระบบอยู่แล้ว'; blocked = true; }
  else if (beYear) { plan = `วันหมดอายุเป็นปี พ.ศ.? กรอกเป็นปี ค.ศ. (${beYear})`; blocked = true; }
  else if (!labelExpiry) { plan = 'กรอกวันหมดอายุตามฉลาก'; blocked = true; }
  else if (target && (target.expiry !== labelExpiry || item.expiry !== labelExpiry)) {
    plan = `ในระบบมี Lot ${target.lot} อยู่แล้ว แต่วันหมดอายุไม่ตรงกัน (ฉลาก ${labelExpiry}, Lot ${item.lot} ${item.expiry}, Lot ${target.lot} ${target.expiry}) อาจเป็นคนละ Lot ตรวจฉลากอีกครั้ง หรือรับเข้าเป็น Lot ใหม่`;
    blocked = true;
  } else if (target) {
    plan = `ในระบบมี Lot ${target.lot} อยู่แล้ว (คงเหลือ ${target.qty} ${item.unit}) จะ "รวม" Lot ${item.lot} (คงเหลือ ${item.systemQty}) เข้าไป ยอดและประวัติย้ายไปทั้งหมด และ Lot ${item.lot} จะถูกลบ`;
  } else {
    plan = `จะ "เปลี่ยนเลข Lot" จาก ${item.lot} เป็น ${name}${labelExpiry !== item.expiry ? ` และวันหมดอายุเป็น ${labelExpiry}` : ''} ยอดและประวัติอยู่ครบ`;
  }

  const field = `width:100%; box-sizing:border-box; height:38px; padding:0 10px; border:1px solid var(--border-default); border-radius:var(--radius-md); background:var(--white); color:var(--text-primary); font:var(--text-sm)/1 var(--font-mono); outline:none;`;
  const label = `display:flex; flex-direction:column; gap:5px; font:var(--fw-semibold) var(--text-xs)/1.3 var(--font-body); color:var(--text-primary);`;
  return (
    <div className="ov-in" onClick={() => !busy && setFixing(null)} style={css(`position:fixed; inset:0; background:rgba(14,24,34,.6); z-index:80; display:grid; place-items:center; padding:20px;`)}>
      <div role="dialog" aria-label="แก้เลข Lot ตามฉลาก" className="tt-in" onClick={(e) => e.stopPropagation()} style={css(`width:min(460px,94vw); max-height:92vh; overflow-y:auto; background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); padding:20px; display:flex; flex-direction:column; gap:14px;`)}>
        <div>
          <div style={css(`font:var(--fw-bold) var(--text-base)/1.3 var(--font-display); color:var(--text-primary);`)}>แก้เลข Lot ตามฉลาก</div>
          <div style={css(`font:var(--text-xs)/1.5 var(--font-body); color:var(--text-secondary); margin-top:4px;`)}>
            {item.reagentName} · ในระบบ <span style={css(`font-family:var(--font-mono);`)}>{item.lot}</span> · หมดอายุ <span style={css(`font-family:var(--font-mono);`)}>{item.expiry}</span> · คงเหลือ {item.systemQty} {item.unit}
          </div>
        </div>
        <label style={css(label)}>
          เลข Lot บนฉลาก
          <input autoFocus value={newLot} onChange={set('newLot')} style={css(field)} />
        </label>
        <label style={css(label)}>
          วันหมดอายุบนฉลาก
          <input type="date" value={labelExpiry} onChange={set('labelExpiry')} style={css(field)} />
        </label>
        {!canManage && (
          <label style={css(label)}>
            หมายเหตุถึงหัวหน้างาน (ถ้ามี)
            <input value={note} onChange={set('note')} style={css(field + ' font-family:var(--font-body);')} />
          </label>
        )}
        <div role="status" style={css(`padding:10px 12px; border-radius:var(--radius-md); background:${blocked && name ? 'var(--amber-100)' : 'var(--surface-sunken)'}; border:1px solid ${blocked && name ? 'var(--amber-fill)' : 'var(--border-subtle)'}; font:var(--text-xs)/1.5 var(--font-body); color:${blocked && name ? 'var(--amber-700)' : 'var(--text-primary)'};`)}>
          {plan}
          {!blocked && <span style={css(`display:block; margin-top:4px; color:var(--text-secondary);`)}>{canManage ? 'บันทึกแล้วจะเสนอให้พิมพ์สติกเกอร์ใหม่ เพราะ QR บนกล่องเดิมจะสแกนไม่เจอ' : 'ส่งให้หัวหน้างานอนุมัติที่หน้า Dashboard ระหว่างนี้นับ Lot นี้ตามปกติได้'}</span>}
        </div>
        <div style={css(`display:flex; justify-content:flex-end; flex-wrap:wrap; gap:10px;`)}>
          <button type="button" disabled={busy} onClick={() => setFixing(null)}
            style={css(`padding:9px 16px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--white); color:var(--text-secondary); cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body);`)}>
            ยกเลิก
          </button>
          <button type="button" disabled={blocked || busy} onClick={() => (canManage ? onCorrect(fixing) : onReport(fixing))}
            style={css(`padding:9px 16px; border-radius:var(--radius-md); border:none; background:${blocked ? 'var(--slate-200)' : 'var(--brand-700)'}; color:${blocked ? 'var(--text-disabled)' : '#fff'}; cursor:${blocked ? 'not-allowed' : busy ? 'progress' : 'pointer'}; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body);`)}>
            {busy ? 'กำลังบันทึก…' : canManage ? (target ? `รวมเข้า Lot ${target.lot}` : 'แก้เลข Lot') : 'แจ้งหัวหน้างาน'}
          </button>
        </div>
      </div>
    </div>
  );
}
