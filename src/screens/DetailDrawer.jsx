import React from 'react';
import { css } from '../css.js';

export function DetailDrawer({ v }) {
  const {
    stop, ic, detailOpen, detail, closeDetail, openPrintSticker,
    role, openEditReagent,
  } = v;
  return detailOpen ? (<>
    <div className="ov-in" onClick={closeDetail} style={css(`position:fixed; inset:0; background:rgba(24,27,42,.42); z-index:40; display:flex; justify-content:flex-end;`)}>
      <div className="dr-in" onClick={stop} style={css(`width:min(480px,94vw); height:100vh; background:var(--surface-card); box-shadow:var(--shadow-lg); display:flex; flex-direction:column; overflow:hidden;`)}>
        <div style={css(`padding:18px 22px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:flex-start; gap:12px;`)}>
          <div style={css(`flex:1; min-width:0;`)}>
            <div style={css(`font:var(--fw-bold) var(--text-lg)/1.25 var(--font-display); color:var(--text-primary);`)}>{detail.th}</div>
            <div style={css(`font:var(--text-2xs)/1.4 var(--font-mono); color:var(--text-tertiary); margin-top:2px;`)}>{detail.code} · {detail.en}</div>
          </div>
          <button onClick={closeDetail} style={css(`border:none; background:var(--slate-100); cursor:pointer; padding:6px; border-radius:var(--radius-sm); color:var(--text-secondary); display:grid; place-items:center;`)}>{ic.close}</button>
        </div>

        <div style={css(`padding:18px 22px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:18px;`)}>
          <div style={css(`position:relative; height:180px; border-radius:var(--radius-lg); overflow:hidden; border:1px solid var(--border-subtle); box-shadow:var(--shadow-sm); flex-shrink:0;`)}>
            <img 
              src={detail.img || '/reagent_placeholder.png'} 
              alt={detail.th} 
              style={css(`width:100%; height:100%; object-fit:cover;`)}
            />
            <div style={css(`position:absolute; inset:0; background:linear-gradient(to top, rgba(14,24,34,0.92) 0%, rgba(14,24,34,0.3) 60%, rgba(14,24,34,0) 100%);`)} />
          </div>

          <div style={css(`display:grid; grid-template-columns:1fr 1fr; gap:10px;`)}>
            <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:11px 13px;`)}>
              <div style={css(`font:var(--text-2xs)/1.3 var(--font-body); color:var(--text-tertiary);`)}>คงเหลือรวม</div>
              <div style={css(`font:var(--fw-bold) var(--text-sm)/1.1 var(--font-mono); color:${detail.onHandColor}; margin-top:2px;`)}>
                {detail.testsPerUnit 
                  ? `${(detail.onHand * detail.testsPerUnit).toLocaleString()} ${detail.subUnit || 'test'} (${detail.onHand} ${detail.unit})` 
                  : `${detail.onHand} ${detail.unit}`}
              </div>
            </div>
            <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:11px 13px;`)}>
              <div style={css(`font:var(--text-2xs)/1.3 var(--font-body); color:var(--text-tertiary);`)}>จุดสั่งซื้อซ้ำ</div>
              <div style={css(`font:var(--fw-bold) var(--text-sm)/1.1 var(--font-mono); color:var(--text-primary); margin-top:2px;`)}>
                {detail.testsPerUnit 
                  ? `${(detail.min * detail.testsPerUnit).toLocaleString()} ${detail.subUnit || 'test'} (${detail.min} ${detail.unit})` 
                  : `${detail.min} ${detail.unit}`}
              </div>
            </div>
          </div>
          <div style={css(`display:flex; flex-direction:column; gap:7px;`)}>
            <div style={css(`display:flex; align-items:center; gap:9px; font:var(--text-sm)/1.4 var(--font-body); color:var(--text-secondary);`)}><span style={css(`display:grid; place-items:center;`)}>{ic.thermo}</span>สภาวะจัดเก็บ <strong style={css(`color:var(--text-primary); font-weight:600;`)}>{detail.storageLabel}</strong></div>
            <div style={css(`display:flex; align-items:center; gap:9px; font:var(--text-sm)/1.4 var(--font-body); color:var(--text-secondary);`)}>
              <span style={css(`display:grid; place-items:center;`)}>{ic.pkg}</span>
              หมวดงาน&nbsp;
              <strong style={css(`color:var(--text-primary); font-weight:600;`)}>
                ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์
              </strong>
              &nbsp;· ผู้ขาย {detail.supplier}
            </div>
          </div>

          <div style={css(`display:flex; gap:10px;`)}>
            <button onClick={detail.onReceive} style={css(`flex:1; display:inline-flex; align-items:center; justify-content:center; gap:7px; padding:10px; border-radius:var(--radius-md); border:1px solid var(--brand-100); background:var(--brand-50); color:var(--brand-700); cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body);`)}><span style={css(`display:grid; place-items:center;`)}>{ic.receive}</span>รับเข้า Lot</button>
            <button onClick={detail.onIssue} style={css(`flex:1; display:inline-flex; align-items:center; justify-content:center; gap:7px; padding:10px; border-radius:var(--radius-md); border:none; background:var(--brand-700); color:#fff; cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body);`)}><span style={css(`display:grid; place-items:center;`)}>{ic.issue}</span>เบิกจ่าย (Withdraw)</button>
          </div>

          {role === 'admin' && (
            <button 
              onClick={() => {
                closeDetail();
                openEditReagent(detail.id);
              }} 
              style={css(`width:100%; display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:10px; border-radius:var(--radius-md); border:1px solid var(--border-strong); background:var(--surface-sunken); color:var(--text-secondary); cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body); transition:all var(--dur-fast);`)}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-brand)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
            >
              📝 แก้ไขข้อมูลน้ำยา (Admin Only)
            </button>
          )}

          <div>
            <div style={css(`font:var(--fw-semibold) var(--text-sm)/1.4 var(--font-body); color:var(--text-primary); margin-bottom:9px;`)}>รายการ Lot · เรียงตาม FEFO (หมดอายุก่อน–เบิกก่อน)</div>
            <div style={css(`display:flex; flex-direction:column; gap:9px;`)}>
              {detail.lots.map((l, lI) => (<React.Fragment key={lI}>
                <div style={css(`border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:12px 14px;`)}>
                  <div style={css(`display:flex; align-items:center; gap:8px; margin-bottom:6px;`)}>
                    <span style={css(`font:var(--fw-bold) var(--text-sm)/1 var(--font-mono); color:var(--text-primary);`)}>Lot {l.lot}</span>
                    {l.fefoBadge ? (<><span style={css(`padding:1px 7px; border-radius:var(--radius-pill); background:var(--brand-700); color:#fff; font:var(--fw-semibold) var(--text-2xs)/1.5 var(--font-body);`)}>{l.fefoBadge}</span></>) : null}
                    <span style={css(`flex:1;`)}></span>
                    <span style={css(`padding:1px 8px; border-radius:var(--radius-pill); background:${l.statusBg}; color:${l.statusFg}; font:var(--fw-semibold) var(--text-2xs)/1.5 var(--font-body);`)}>{l.statusLabel}</span>
                  </div>
                  <div style={css(`display:grid; grid-template-columns:1fr 1fr; gap:6px 14px; font:var(--text-2xs)/1.5 var(--font-body); color:var(--text-secondary);`)}>
                    <div>หมดอายุ <span style={css(`font-family:var(--font-mono); color:${l.dayColor}; font-weight:600;`)}>{l.expiry}</span></div>
                    <div style={css(`color:${l.dayColor}; font-weight:600;`)}>{l.dayLabel}</div>
                    <div>คงเหลือ <span style={css(`font-family:var(--font-mono); color:var(--text-primary); font-weight:600;`)}>{l.qty} / {l.recv}</span></div>
                    <div>{l.loc}</div>
                    <div style={css(`grid-column:1/3; display:flex; align-items:center; justify-content:space-between; color:var(--text-tertiary);`)}>
                      <div style={css(`display:flex; align-items:center; gap:6px;`)}>
                        <span style={css(`display:grid; place-items:center;`)}>{ic.qr}</span>
                        <span style={css(`font-family:var(--font-mono);`)}>{l.qr}</span>
                      </div>
                      <div style={css(`display:flex; align-items:center; gap:6px;`)}>
                        <button
                          type="button"
                          onClick={() => openPrintSticker(l, detail)}
                          style={css(`background:transparent; border:1px solid var(--border-default); border-radius:var(--radius-sm); padding:2px 6px; font:var(--text-2xs)/1.2 var(--font-body); color:var(--text-secondary); cursor:pointer; display:flex; align-items:center; gap:3px;`)}
                        >
                          🖨️ พิมพ์ (2x4)
                        </button>
                        {l.qty > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              closeDetail();
                              v.onIssueLot(detail.id, l.id);
                            }}
                            style={css(`background:var(--brand-50); border:1px solid var(--brand-100); border-radius:var(--radius-sm); padding:2px 6px; font:var(--text-2xs)/1.2 var(--font-body); color:var(--brand-700); cursor:pointer; display:flex; align-items:center; gap:3px;`)}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-100)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--brand-50)'; }}
                          >
                            {ic.issue} สแกนเบิกด่วน
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>) : null;
}
