import React from 'react';
import { css } from '../css.js';

export function ReagentLists({ v }) {
  const {
    isReagentLists, reagentsList, activeLotsList, ic,
    canManage, openRegister, txnRows, openPrintSticker, deleteReagent, user,
    updateReagentCategory,
  } = v;

  const isAdmin = user && user.roleId === 'admin';

  const [search, setSearch] = React.useState('');
  const [selectedReagent, setSelectedReagent] = React.useState(null);

  if (!isReagentLists) return null;

  const query = search.trim().toLowerCase();
  const filtered = reagentsList.filter(r => 
    r.code.toLowerCase().includes(query) || 
    r.th.toLowerCase().includes(query) || 
    (r.en || '').toLowerCase().includes(query)
  );

  const getCategoryLabel = (c) => ({ CHE: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์', HEM: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์', IMM: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์', MIP: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์', MDC: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์', HMS: 'บริการศูนย์การแพทย์', ADV: 'ตรวจวินิจฉัยขั้นสูง' })[c] || c;
  const getStorageLabel = (s) => ({ REFRIGERATED_2_8: '2–8°C', FROZEN_40: '−40°C', ROOM_TEMP: 'อุณหภูมิห้อง' })[s] || s;

  const formatStock = (qty, reagent) => {
    if (reagent.testsPerUnit) {
      const totalTests = qty * reagent.testsPerUnit;
      return `${totalTests.toLocaleString()} ${reagent.subUnit || 'test'} (${qty} ${reagent.unit})`;
    }
    return `${qty} ${reagent.unit}`;
  };

  const localStyle = `
    /* Reagent Card Button */
    .reagent-card-btn {
      transition: transform var(--dur-fast), border-color var(--dur-fast), box-shadow var(--dur-fast);
    }
    .reagent-card-btn:hover {
      border-color: var(--brand-700) !important;
      transform: translateY(-2px);
      box-shadow: var(--glow-brand-soft);
    }
    .reagent-card-btn:focus-visible {
      border-color: var(--brand-700) !important;
      box-shadow: 0 0 0 3px var(--focus-ring);
      outline: none;
    }

    /* Modal Close Icon Button */
    .reagent-close-btn {
      border: none;
      background: var(--slate-100);
      cursor: pointer;
      padding: 6px;
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      display: grid;
      place-items: center;
      transition: background var(--dur-fast), box-shadow var(--dur-fast);
    }
    .reagent-close-btn:hover {
      background: var(--slate-200);
    }
    .reagent-close-btn:focus-visible {
      box-shadow: 0 0 0 2px var(--focus-ring);
      outline: none;
    }

    /* Primary Register Button */
    .reagent-primary-btn {
      margin-left: auto;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: var(--radius-md);
      border: none;
      background: var(--brand-700);
      color: #fff;
      cursor: pointer;
      font: var(--fw-semibold) var(--text-sm)/1 var(--font-body);
      box-shadow: var(--glow-brand-soft);
      transition: background var(--dur-fast), transform var(--dur-fast), box-shadow var(--dur-fast);
    }
    .reagent-primary-btn:hover {
      background: var(--brand-800);
      transform: translateY(-1px);
    }
    .reagent-primary-btn:focus-visible {
      box-shadow: 0 0 0 3px var(--focus-ring);
      outline: none;
    }

    /* Secondary Close/Cancel Button */
    .reagent-secondary-btn {
      padding: 8px 14px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-default);
      background: var(--white);
      color: var(--text-secondary);
      cursor: pointer;
      font: var(--fw-semibold) var(--text-2xs)/1 var(--font-body);
      transition: background var(--dur-fast), border-color var(--dur-fast), box-shadow var(--dur-fast);
    }
    .reagent-secondary-btn:hover {
      background: var(--slate-50);
      border-color: var(--border-strong);
    }
    .reagent-secondary-btn:focus-visible {
      box-shadow: 0 0 0 2px var(--focus-ring);
      outline: none;
    }
  `;

  return (
    <>
      <style>{localStyle}</style>

      <div className="qms-rise" style={css(`max-width:1180px; display:flex; flex-direction:column; gap:18px;`)}>
        {/* Search and Action bar */}
        <div style={css(`display:flex; align-items:center; gap:14px; flex-wrap:wrap; width:100%;`)}>
          <div style={css(`position:relative; flex:1; max-width:480px; min-width:240px;`)}>
            <span style={css(`position:absolute; left:12px; top:50%; transform:translateY(-50%); display:grid; place-items:center; color:var(--text-tertiary);`)}>{ic.search}</span>
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="ค้นหาชื่อน้ำยา หรือรหัสสินค้า..." 
              aria-label="ค้นหาชื่อน้ำยา หรือรหัสสินค้า"
              style={css(`width:100%; box-sizing:border-box; padding:10px 14px 10px 36px; border:1px solid var(--border-default); border-radius:var(--radius-md); background:var(--white); font:var(--fw-regular) var(--text-sm)/1.4 var(--font-body); color:var(--text-primary); outline:none;`)} 
            />
          </div>
          {canManage && (
            <button
              onClick={openRegister}
              className="reagent-primary-btn"
            >
              {ic.boxes} ลงทะเบียนน้ำยาใหม่
            </button>
          )}
        </div>

        {/* Reagent Grid */}
        {filtered.length > 0 ? (
          <div style={css(`display:grid; grid-template-columns:repeat(auto-fill, minmax(270px, 1fr)); gap:18px;`)}>
            {filtered.map(r => {
              const lots = activeLotsList.filter(l => l.rid === r.id && l.qty > 0 && l.status === 'ACTIVE');
              const totalStock = lots.reduce((sum, l) => sum + l.qty, 0);
              const isOutOfStock = totalStock === 0;
              const isLowStock = totalStock <= r.min;

              return (
                <button 
                  key={r.id} 
                  onClick={() => setSelectedReagent(r)}
                  className="qrow reagent-card-btn"
                  style={css(`background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); overflow:hidden; display:flex; flex-direction:column; cursor:pointer; width:100%; text-align:left; font-family:inherit; padding:0; outline:none;`)}
                >
                  {/* Card Image Header */}
                  <div style={css(`position:relative; height:140px; width:100%; background:var(--surface-sunken); overflow:hidden;`)}>
                    <img 
                      src={r.img || '/reagent_placeholder.png'} 
                      alt={r.th} 
                      style={css(`width:100%; height:100%; object-fit:cover;`)}
                    />
                    <div style={css(`position:absolute; inset:0; background:linear-gradient(to top, rgba(23,36,46,0.95) 0%, rgba(23,36,46,0.2) 60%, rgba(23,36,46,0) 100%);`)} />
                    <div style={css(`position:absolute; bottom:10px; left:12px; right:12px;`)}>
                      <span style={css(`padding:2px 6px; border-radius:var(--radius-pill); background:rgba(43,166,198,.2); border:1px solid rgba(43,166,198,.3); color:var(--brand-800); font:var(--fw-semibold) 8px/1.2 var(--font-body); white-space:nowrap; display:inline-block; max-width:calc(100% - 4px); overflow:hidden; text-overflow:ellipsis;`)}>
                        {getCategoryLabel(r.cat)}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={css(`padding:14px; display:flex; flex-direction:column; gap:10px; flex:1; width:100%; box-sizing:border-box;`)}>
                    <div>
                      <div style={css(`font:var(--fw-bold) var(--text-sm)/1.35 var(--font-body); color:var(--text-primary); min-height:38px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;`)}>
                        {r.th}
                      </div>
                      <div style={css(`font:var(--text-2xs)/1.2 var(--font-mono); color:var(--text-tertiary); margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`)}>
                        {r.en || 'No English Name'}
                      </div>
                    </div>

                    <div style={css(`border-top:1px solid var(--border-subtle); padding-top:10px; display:flex; flex-direction:column; gap:4px; font:var(--text-2xs)/1.3 var(--font-body); color:var(--text-secondary);`)}>
                      <div style={css(`display:flex; justify-content:space-between;`)}>
                        <span>สภาวะจัดเก็บ:</span>
                        <strong style={css(`color:var(--text-primary);`)}>{getStorageLabel(r.storage)}</strong>
                      </div>
                      <div style={css(`display:flex; justify-content:space-between;`)}>
                        <span>ผู้จัดจำหน่าย:</span>
                        <span style={css(`color:var(--text-primary); text-align:right; max-width:160px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;`)}>{r.supplier}</span>
                      </div>
                    </div>

                    <div style={css(`margin-top:auto; padding-top:10px; border-top:1px solid var(--border-subtle); display:flex; align-items:center; justify-content:space-between;`)}>
                      <div>
                        <div style={css(`font:var(--text-3xs)/1 var(--font-body); color:var(--text-tertiary);`)}>ยอดคงคลังรวม</div>
                        <div style={css(`font:var(--fw-bold) var(--text-sm)/1.3 var(--font-mono); color:${isOutOfStock ? 'var(--red-700)' : (isLowStock ? 'var(--amber-700)' : 'var(--green-700)')}; margin-top:2px;`)}>
                          {formatStock(totalStock, r)}
                        </div>
                      </div>
                      <div>
                        {isOutOfStock ? (
                          <span style={css(`padding:2px 8px; border-radius:var(--radius-pill); background:var(--red-100); color:var(--red-700); font:var(--fw-semibold) var(--text-3xs)/1.3 var(--font-body);`)}>
                            สินค้าหมด
                          </span>
                        ) : (isLowStock ? (
                          <span style={css(`padding:2px 8px; border-radius:var(--radius-pill); background:var(--amber-100); color:var(--amber-700); font:var(--fw-semibold) var(--text-3xs)/1.3 var(--font-body);`)}>
                            สต็อกต่ำ
                          </span>
                        ) : (
                          <span style={css(`padding:2px 8px; border-radius:var(--radius-pill); background:var(--green-100); color:var(--green-700); font:var(--fw-semibold) var(--text-3xs)/1.3 var(--font-body);`)}>
                            พร้อมใช้งาน
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div style={css(`padding:40px; text-align:center; background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md); color:var(--text-tertiary); font:var(--text-sm)/1.4 var(--font-body);`)}>
            ไม่พบรายชื่อน้ำยาที่ตรงกับการค้นหา
          </div>
        )}
      </div>

      {/* Detail Popup Modal */}
      {selectedReagent && (() => {
        // Re-derive from the live list so in-place edits (e.g. category change) refresh immediately.
        const r = reagentsList.find(x => x.id === selectedReagent.id) || selectedReagent;
        const rLots = activeLotsList.filter(l => l.rid === r.id && l.qty > 0 && l.status === 'ACTIVE')
          .slice()
          .sort((a, b) => a.expiry.localeCompare(b.expiry)); // FEFO sort
        const totalStock = rLots.reduce((sum, l) => sum + l.qty, 0);
        const rTxns = txnRows.filter(tx => tx.rid === r.id);

        return (
          <div 
            className="no-print"
            onClick={() => setSelectedReagent(null)} 
            style={css(`position:fixed; inset:0; background:rgba(14,24,34,0.75); backdrop-filter:blur(4px); z-index:100; display:grid; place-items:center; padding:20px; box-sizing:border-box;`)}
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="qms-rise"
              style={css(`background:var(--white); width:100%; max-width:1040px; border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-lg); display:flex; flex-direction:column; max-height:90vh; border:1px solid var(--border-subtle);`)}
            >
              {/* Modal Header */}
              <div style={css(`padding:16px 20px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; justify-content:space-between;`)}>
                <div>
                  <div style={css(`font:var(--fw-bold) var(--text-md)/1.2 var(--font-display); color:var(--text-primary);`)}>ข้อมูลการลงทะเบียนน้ำยา</div>
                </div>
                <button 
                  onClick={() => setSelectedReagent(null)} 
                  className="reagent-close-btn"
                  aria-label="ปิดหน้าต่างรายละเอียด"
                >
                  {ic.close}
                </button>
              </div>

              {/* Modal Body - 2 Columns (Side-by-Side) */}
              <div className="reagent-detail-body" style={css(`padding:20px; overflow-y:auto; display:flex; gap:24px; flex-direction:row; flex-wrap:wrap; box-sizing:border-box;`)}>
                
                {/* Left Column: Reagent details & Lots */}
                <div style={css(`flex:1; min-width:300px; display:flex; flex-direction:column; gap:16px;`)}>
                  
                  {/* Image hero banner */}
                  <div style={css(`position:relative; height:150px; border-radius:var(--radius-md); overflow:hidden; border:1px solid var(--border-subtle); flex-shrink:0;`)}>
                    <img 
                      src={r.img || '/reagent_placeholder.png'} 
                      alt={r.th} 
                      style={css(`width:100%; height:100%; object-fit:cover;`)}
                    />
                    <div style={css(`position:absolute; inset:0; background:linear-gradient(to top, rgba(14,24,34,0.92) 0%, rgba(14,24,34,0.2) 60%, rgba(14,24,34,0) 100%);`)} />
                    <div style={css(`position:absolute; bottom:12px; left:14px; right:14px;`)}>
                      <span style={css(`padding:2px 8px; border-radius:var(--radius-pill); background:rgba(43,166,198,.24); border:1px solid rgba(43,166,198,.4); color:var(--brand-800); font:var(--fw-semibold) var(--text-3xs)/1.2 var(--font-body); text-transform:uppercase;`)}>
                        {getCategoryLabel(r.cat)}
                      </span>
                    </div>
                  </div>

                  {/* Registration Data Grid */}
                  <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:14px 16px; display:flex; flex-direction:column; gap:10px;`)}>
                    <div style={css(`display:grid; grid-template-columns:repeat(2, 1fr); gap:10px 20px; font:var(--text-2xs)/1.4 var(--font-body); color:var(--text-secondary);`)}>
                      <div>
                        <div style={css(`color:var(--text-tertiary); font-size:var(--text-3xs); text-transform:uppercase;`)}>หมวดงาน</div>
                        <div style={css(`font:var(--fw-semibold) var(--text-xs)/1.3 var(--font-body); color:var(--text-primary); margin-top:2px;`)}>
                          ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์
                        </div>
                      </div>
                      <div>
                        <div style={css(`color:var(--text-tertiary); font-size:var(--text-3xs); text-transform:uppercase;`)}>หมวด</div>
                        <div style={css(`font:var(--fw-semibold) var(--text-xs)/1.3 var(--font-body); color:var(--text-primary); margin-top:2px;`)}>
                          {getCategoryLabel(r.cat)}
                        </div>
                      </div>

                      <div style={css(`grid-column:1/3; border-top:1px dashed var(--border-subtle); padding-top:6px;`)}>
                        <div style={css(`color:var(--text-tertiary); font-size:var(--text-3xs);`)}>ชื่อน้ำยา</div>
                        <div style={css(`font:var(--fw-semibold) var(--text-xs)/1.3 var(--font-body); color:var(--text-primary); margin-top:2px;`)}>
                          {r.th === r.en || !r.en ? r.th : `${r.en} (${r.th})`}
                        </div>
                      </div>
                      
                      <div style={css(`border-top:1px dashed var(--border-subtle); padding-top:6px;`)}>
                        <div style={css(`color:var(--text-tertiary); font-size:var(--text-3xs);`)}>อุณหภูมิการเก็บรักษา</div>
                        <div style={css(`font:var(--fw-semibold) var(--text-xs)/1.3 var(--font-body); color:var(--text-primary); margin-top:2px;`)}>{getStorageLabel(r.storage)}</div>
                      </div>
                      <div style={css(`border-top:1px dashed var(--border-subtle); padding-top:6px;`)}>
                        <div style={css(`color:var(--text-tertiary); font-size:var(--text-3xs);`)}>หน่วยนับสินค้า</div>
                        <div style={css(`font:var(--fw-semibold) var(--text-xs)/1.3 var(--font-body); color:var(--text-primary); margin-top:2px;`)}>
                          {(() => {
                            if (r.subUnit) {
                              const qty = r.subUnitQty || 1;
                              if (r.testsPerSubUnit) {
                                return `${r.unit} / ${qty} ${r.subUnit} / ${r.testsPerSubUnit} tests`;
                              }
                              return `${r.unit} / ${qty} ${r.subUnit}`;
                            }
                            if (r.testsPerUnit) {
                              return `${r.unit} / ${r.testsPerUnit} tests`;
                            }
                            return r.unit;
                          })()}
                        </div>
                      </div>
                      
                      <div style={css(`border-top:1px dashed var(--border-subtle); padding-top:6px;`)}>
                        <div style={css(`color:var(--text-tertiary); font-size:var(--text-3xs);`)}>จุดเตือนสต็อกต่ำสุด (Min)</div>
                        <div style={css(`font:var(--fw-semibold) var(--text-xs)/1.3 var(--font-mono); color:var(--text-primary); margin-top:2px;`)}>
                          {r.min} {r.unit}
                        </div>
                      </div>
                      <div style={css(`border-top:1px dashed var(--border-subtle); padding-top:6px;`)}>
                        <div style={css(`color:var(--text-tertiary); font-size:var(--text-3xs);`)}>ปริมาณสั่งซื้อแนะนำ (Reorder)</div>
                        <div style={css(`font:var(--fw-semibold) var(--text-xs)/1.3 var(--font-mono); color:var(--text-primary); margin-top:2px;`)}>
                          {r.reorder || r.min} {r.unit}
                        </div>
                      </div>

                      <div style={css(`grid-column:1/3; border-top:1px dashed var(--border-subtle); padding-top:6px;`)}>
                        <div style={css(`color:var(--text-tertiary); font-size:var(--text-3xs);`)}>ผู้จัดจำหน่าย</div>
                        <div style={css(`font:var(--fw-semibold) var(--text-xs)/1.3 var(--font-body); color:var(--text-primary); margin-top:2px;`)}>{r.supplier}</div>
                      </div>
                      
                      <div style={css(`grid-column:1/3; border-top:1px dashed var(--border-subtle); padding-top:6px; display:flex; justify-content:space-between; align-items:center;`)}>
                        <div>
                          <div style={css(`color:var(--text-tertiary); font-size:var(--text-3xs);`)}>ยอดคงคลังรวมปัจจุบัน</div>
                          <div style={css(`font:var(--fw-bold) var(--text-sm)/1.3 var(--font-mono); color:${totalStock <= r.min ? 'var(--red-700)' : 'var(--green-700)'}; margin-top:2px;`)}>
                            {formatStock(totalStock, r)}
                          </div>
                        </div>
                        <span style={css(`padding:4px 10px; border-radius:var(--radius-pill); background:${totalStock === 0 ? 'var(--red-100)' : (totalStock <= r.min ? 'var(--amber-100)' : 'var(--green-100)')}; color:${totalStock === 0 ? 'var(--red-700)' : (totalStock <= r.min ? 'var(--amber-700)' : 'var(--green-700)')}; font:var(--fw-semibold) var(--text-3xs)/1 var(--font-body);`)}>
                          {totalStock === 0 ? 'สินค้าหมดคลัง' : (totalStock <= r.min ? 'สต็อกต่ำกว่าเกณฑ์' : 'สินค้าพร้อมใช้งาน')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Lots list */}
                  <div>
                    <div style={css(`font:var(--fw-semibold) var(--text-xs)/1.4 var(--font-body); color:var(--text-primary); margin-bottom:8px;`)}>
                      ล็อตสินค้าหมุนเวียนในคลัง ({rLots.length} ล็อต)
                    </div>
                    {rLots.length > 0 ? (
                      <div style={css(`display:flex; flex-direction:column; gap:6px;`)}>
                        {rLots.map(l => {
                          const d = Math.round((new Date(l.expiry + 'T00:00:00') - new Date('2026-06-29T00:00:00')) / 86400000);
                          const severity = d <= 30 ? 'critical' : (d <= 60 ? 'warning' : (d <= 90 ? 'watch' : 'ok'));
                          const c = ({
                            critical: { fg: 'var(--red-700)', bg: 'var(--red-50)', border: 'var(--red-200)' },
                            warning: { fg: 'var(--amber-700)', bg: 'var(--amber-50)', border: 'var(--amber-200)' },
                            watch: { fg: 'var(--blue-700)', bg: 'var(--blue-50)', border: 'var(--blue-200)' },
                            ok: { fg: 'var(--green-700)', bg: 'var(--green-50)', border: 'var(--green-200)' }
                          })[severity];
                          const dayLabel = d < 0 ? 'หมดอายุแล้ว' : (d === 0 ? 'หมดอายุวันนี้' : `เหลือ ${d} วัน`);

                          return (
                            <div 
                              key={l.id} 
                              style={css(`border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:10px 12px; display:flex; align-items:center; justify-content:space-between; background:var(--white);`)}
                            >
                              <div style={css(`min-width:0;`)}>
                                <div style={css(`display:flex; align-items:center; gap:8px;`)}>
                                  <span style={css(`font:var(--fw-bold) var(--text-2xs)/1 var(--font-mono); color:var(--text-primary);`)}>Lot {l.lot}</span>
                                  <span style={css(`font-family:var(--font-mono); font-size:var(--text-3xs); color:var(--text-tertiary);`)}>( {l.loc} )</span>
                                </div>
                                <div style={css(`font:var(--text-3xs)/1.3 var(--font-body); color:var(--text-tertiary); margin-top:4px; display:flex; align-items:center; gap:8px;`)}>
                                  <span>หมดอายุ: <span style={css(`font-family:var(--font-mono); font-weight:600; color:var(--text-secondary);`)}>{l.expiry}</span></span>
                                  <span style={{ color: 'var(--border-strong)' }}>|</span>
                                  <button
                                    type="button"
                                    onClick={() => openPrintSticker(l, r)}
                                    style={css(`background:var(--slate-50); border:1px solid var(--border-default); border-radius:var(--radius-sm); padding:2px 6px; font:var(--text-3xs)/1.2 var(--font-body); color:var(--text-secondary); cursor:pointer; display:inline-flex; align-items:center; gap:3px; transition:all var(--dur-fast);`)}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--slate-100)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--slate-50)'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                                  >
                                    🏷️ สติกเกอร์ QR
                                  </button>
                                  {canManage && (
                                    <>
                                      <span style={{ color: 'var(--border-strong)' }}>|</span>
                                      <button
                                        type="button"
                                        onClick={() => v.openEditLot(l.id)}
                                        style={css(`background:var(--slate-50); border:1px solid var(--border-default); border-radius:var(--radius-sm); padding:2px 6px; font:var(--text-3xs)/1.2 var(--font-body); color:var(--text-secondary); cursor:pointer; display:inline-flex; align-items:center; gap:3px; transition:all var(--dur-fast);`)}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--slate-100)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--slate-50)'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                                      >
                                        ✏️ แก้ไข
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => v.deleteLotReceive(l.id)}
                                        style={css(`background:var(--slate-50); border:1px solid var(--red-600); border-radius:var(--radius-sm); padding:2px 6px; font:var(--text-3xs)/1.2 var(--font-body); color:var(--red-600); cursor:pointer; display:inline-flex; align-items:center; gap:3px; transition:all var(--dur-fast);`)}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(226,104,94,0.08)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--slate-50)'; }}
                                      >
                                        🗑️ ลบ
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div style={css(`display:flex; align-items:center; gap:12px;`)}>
                                <div style={css(`text-align:right;`)}>
                                  <div style={css(`font:var(--fw-bold) var(--text-2xs)/1 var(--font-mono); color:var(--text-primary);`)}>{l.qty} / {l.recv} {r.unit}</div>
                                  <span style={css(`padding:1px 6px; border-radius:var(--radius-pill); background:${c.bg}; color:${c.fg}; font:var(--fw-semibold) var(--text-3xs)/1.2 var(--font-body); display:inline-block; margin-top:4px;`)}>
                                    {dayLabel}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={css(`padding:16px; text-align:center; border:1px dashed var(--border-subtle); border-radius:var(--radius-md); font:var(--text-2xs)/1.4 var(--font-body); color:var(--text-tertiary);`)}>
                        ไม่มีสินค้าล็อตหมุนเวียนในคลังขณะนี้
                      </div>
                    )}
                  </div>

                </div>

                {/* Right Column: Transaction history (Separated) */}
                <div className="reagent-detail-right" style={css(`flex:1.2; min-width:320px; display:flex; flex-direction:column; gap:12px; border-left:1px solid var(--border-subtle); padding-left:24px; box-sizing:border-box;`)}>
                  <div style={css(`font:var(--fw-semibold) var(--text-xs)/1.4 var(--font-body); color:var(--text-primary); margin-bottom:4px;`)}>
                    ประวัติการนำเข้า–เบิกจ่ายทั้งหมด (Transaction Logs)
                  </div>
                  {rTxns.length > 0 ? (
                    <div style={css(`display:flex; flex-direction:column; gap:8px; overflow-y:auto; max-height:540px; padding-right:4px;`)}>
                      {rTxns.map(tx => (
                        <div 
                          key={tx.id} 
                          style={css(`border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:10px 12px; display:flex; align-items:center; justify-content:space-between; gap:12px;`)}
                        >
                          <div style={css(`min-width:0; flex:1;`)}>
                            <div style={css(`display:flex; align-items:center; gap:8px; flex-wrap:wrap;`)}>
                              <span style={css(`padding:2px 6px; border-radius:var(--radius-sm); background:${tx.bg}; color:${tx.fg}; font:var(--fw-semibold) var(--text-3xs)/1.2 var(--font-body); white-space:nowrap;`)}>
                                {tx.typeLabel}
                              </span>
                              <span style={css(`font:var(--fw-semibold) var(--text-2xs)/1 var(--font-mono); color:var(--text-primary);`)}>
                                Lot {tx.lot}
                              </span>
                              {tx.ref && (
                                <span style={css(`font-family:var(--font-mono); font-size:var(--text-3xs); color:var(--text-tertiary);`)}>
                                  Ref: {tx.ref}
                                </span>
                              )}
                            </div>
                            <div style={css(`font:var(--text-3xs)/1.3 var(--font-body); color:var(--text-tertiary); margin-top:4px;`)}>
                              โดย {tx.by} · {tx.at} ({tx.scanLabel})
                            </div>
                          </div>

                          <div style={css(`font:var(--fw-bold) var(--text-2xs)/1 var(--font-mono); color:${tx.qtyColor}; text-align:right; white-space:nowrap;`)}>
                            {tx.qtyLabel}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={css(`padding:24px; text-align:center; border:1px dashed var(--border-subtle); border-radius:var(--radius-md); font:var(--text-2xs)/1.4 var(--font-body); color:var(--text-tertiary);`)}>
                      ไม่มีประวัติการเคลื่อนไหวสำหรับน้ำยานี้
                    </div>
                  )}
                </div>

              </div>

              {/* Modal Footer */}
              <div style={css(`padding:12px 20px; border-top:1px solid var(--border-subtle); background:var(--slate-50); display:flex; justify-content:space-between; align-items:center;`)}>
                <div>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        if (window.confirm(`คุณต้องการลบน้ำยา "${r.th}" และประวัติสต็อกล็อตทั้งหมดออกจากระบบใช่หรือไม่?`)) {
                          deleteReagent(r.id);
                          setSelectedReagent(null);
                        }
                      }}
                      style={css(`padding:8px 14px; border-radius:var(--radius-md); border:none; background:var(--red-600); color:#fff; cursor:pointer; font:var(--fw-semibold) var(--text-2xs)/1 var(--font-body); transition:background var(--dur-fast);`)}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--red-700)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--red-600)'; }}
                    >
                      🗑️ ลบน้ำยานี้ออกจากระบบ
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => setSelectedReagent(null)} 
                  className="reagent-secondary-btn"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
