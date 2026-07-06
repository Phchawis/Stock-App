import React from 'react';
import { css } from '../css.js';

export function Audit({ v }) {
  const {
    isAudit, txnRows, user, clearTxns, canManage,
  } = v;

  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('ALL');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');

  if (!isAudit) return null;

  const isAdmin = user && user.roleId === 'admin';

  // Client-side filtering logic based on name, code, lot, type, and date range
  const filteredRows = txnRows.filter(t => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || 
      t.name.toLowerCase().includes(q) || 
      t.code.toLowerCase().includes(q) ||
      t.lot.toLowerCase().includes(q) ||
      (t.by && t.by.toLowerCase().includes(q)) ||
      (t.ref && t.ref.toLowerCase().includes(q));

    const matchesType = typeFilter === 'ALL' || t.type === typeFilter;

    // Date range filter
    const rowDate = t.at.substring(0, 10); // Format YYYY-MM-DD
    const matchesStart = !startDate || rowDate >= startDate;
    const matchesEnd = !endDate || rowDate <= endDate;

    return matchesSearch && matchesType && matchesStart && matchesEnd;
  });

  // Group filtered rows by date (YYYY-MM-DD)
  const groupedRows = {};
  filteredRows.forEach(t => {
    const dateStr = t.at.substring(0, 10);
    if (!groupedRows[dateStr]) {
      groupedRows[dateStr] = [];
    }
    groupedRows[dateStr].push(t);
  });

  // Sort dates descending
  const sortedDates = Object.keys(groupedRows).sort((a, b) => b.localeCompare(a));

  return (
    <>
      <style>{`
        .audit-row-mobile { display: none; }
        @media (max-width: 768px) {
          .audit-thead { display: none !important; }
          .audit-row-desktop { display: none !important; }
          .audit-row-mobile { display: flex !important; }
        }
      `}</style>
      <div className="qms-rise" style={css(`max-width:1180px; display:flex; flex-direction:column; gap:16px;`)}>
        {/* Controls Grid */}
        <div style={css(`display:flex; flex-direction:column; gap:12px;`)}>
          <div style={css(`display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:14px;`)}>
            <div style={css(`display:flex; gap:12px; flex:1; min-width:320px;`)}>
              {/* Search Box */}
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  placeholder="ค้นหาชื่อน้ำยา, รหัส, Lot, เลขใบเบิก, ผู้ทำรายการ..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={css(`width:100%; height:38px; box-sizing:border-box; padding:0 36px 0 12px; background:var(--white); border:1px solid var(--border-default); border-radius:var(--radius-md); font:var(--type-body); color:var(--text-primary); outline:none; transition:border-color var(--dur-fast);`)}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--border-brand)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-default)'}
                />
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-tertiary)', display: 'flex' }}>
                  🔍
                </span>
              </div>

              {/* Type Filter Select */}
              <div style={{ position: 'relative', width: '180px' }}>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  style={css(`appearance:none; width:100%; height:38px; box-sizing:border-box; padding:0 30px 0 12px; background:var(--white); border:1px solid var(--border-default); border-radius:var(--radius-md); font:var(--type-body); color:var(--text-primary); outline:none; cursor:pointer; transition:border-color var(--dur-fast);`)}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--border-brand)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-default)'}
                >
                  <option value="ALL">ทั้งหมด</option>
                  <option value="RECEIVE">รับเข้าคลัง (+)</option>
                  <option value="ISSUE">เบิกจ่ายน้ำยา (-)</option>
                  <option value="ADJUST">ปรับปรุงยอด</option>
                  <option value="DISPOSE">ทำลายน้ำยา</option>
                  <option value="DELETE">ลบน้ำยา</option>
                </select>
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-tertiary)', display: 'flex', fontSize: '8px' }}>
                  ▼
                </span>
              </div>
            </div>

            {/* Clear history button */}
            {isAdmin && (
              <button 
                onClick={clearTxns}
                style={css(`display:inline-flex; align-items:center; gap:8px; padding:9px 16px; border-radius:var(--radius-md); border:1px solid var(--red-600); background:transparent; color:var(--red-600); cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body); transition:all var(--dur-fast); height:38px;`)}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(226,104,94,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                🗑️ ล้างประวัติทั้งหมด
              </button>
            )}
          </div>

          {/* Date Range Row */}
          <div style={css(`display:flex; flex-wrap:wrap; gap:12px; align-items:center; background:var(--surface-card); padding:10px 14px; border-radius:var(--radius-md); border:1px solid var(--border-subtle);`)}>
            <div style={css(`font:var(--fw-medium) var(--text-2xs)/1.2 var(--font-body); color:var(--text-secondary);`)}>ช่วงเวลาทำรายการ:</div>
            
            <div style={css(`display:flex; align-items:center; gap:8px;`)}>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={css(`height:32px; padding:0 8px; background:var(--white); border:1px solid var(--border-default); border-radius:var(--radius-md); font:var(--text-2xs)/1 var(--font-body); color:var(--text-primary); outline:none;`)}
              />
              <span style={css(`font:var(--text-3xs)/1 var(--font-body); color:var(--text-tertiary);`)}>ถึง</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={css(`height:32px; padding:0 8px; background:var(--white); border:1px solid var(--border-default); border-radius:var(--radius-md); font:var(--text-2xs)/1 var(--font-body); color:var(--text-primary); outline:none;`)}
              />
            </div>

            {(startDate || endDate) && (
              <button
                type="button"
                onClick={() => { setStartDate(''); setEndDate(''); }}
                style={css(`border:none; background:transparent; color:var(--brand-700); cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body); text-decoration:underline;`)}
              >
                ล้างช่วงเวลา
              </button>
            )}
          </div>
        </div>

        {/* Movement Table */}
        <div style={css(`background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md); box-shadow:var(--shadow-sm); overflow:hidden;`)}>
          
          <div className="audit-thead" style={css(`display:grid; grid-template-columns:0.85fr 1.6fr 0.8fr 0.8fr 0.9fr 1.2fr${canManage ? ' 1fr' : ''}; gap:12px; padding:11px 18px; background:var(--slate-50); border-bottom:1px solid var(--border-subtle);`)}>
            <div style={css(`font:var(--fw-semibold) var(--text-2xs)/1.2 var(--font-body); color:var(--text-tertiary); text-transform:uppercase; letter-spacing:.05em;`)}>ประเภท</div>
            <div style={css(`font:var(--fw-semibold) var(--text-2xs)/1.2 var(--font-body); color:var(--text-tertiary); text-transform:uppercase; letter-spacing:.05em;`)}>น้ำยา · Lot</div>
            <div style={css(`font:var(--fw-semibold) var(--text-2xs)/1.2 var(--font-body); color:var(--text-tertiary); text-transform:uppercase; letter-spacing:.05em; text-align:right;`)}>จำนวน</div>
            <div style={css(`font:var(--fw-semibold) var(--text-2xs)/1.2 var(--font-body); color:var(--text-tertiary); text-transform:uppercase; letter-spacing:.05em;`)}>วิธีระบุ</div>
            <div style={css(`font:var(--fw-semibold) var(--text-2xs)/1.2 var(--font-body); color:var(--text-tertiary); text-transform:uppercase; letter-spacing:.05em;`)}>ผู้ทำรายการ</div>
            <div style={css(`font:var(--fw-semibold) var(--text-2xs)/1.2 var(--font-body); color:var(--text-tertiary); text-transform:uppercase; letter-spacing:.05em; text-align:right;`)}>เวลา · อ้างอิง</div>
            {canManage && (
              <div style={css(`font:var(--fw-semibold) var(--text-2xs)/1.2 var(--font-body); color:var(--text-tertiary); text-transform:uppercase; letter-spacing:.05em; text-align:right;`)}>ดำเนินการ</div>
            )}
          </div>
          
          {sortedDates.length > 0 ? (
            sortedDates.map((dateStr) => {
              const dObj = new Date(dateStr + 'T00:00:00');
              const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
              const formattedDate = `${dObj.getDate()} ${thaiMonths[dObj.getMonth()]} ${dObj.getFullYear() + 543}`;

              return (
                <div key={dateStr} style={css(`display:flex; flex-direction:column; border-bottom:1px solid var(--border-subtle);`)}>
                  {/* Sticky Date Header */}
                  <div style={css(`background:var(--slate-100); padding:8px 18px; font:var(--fw-semibold) var(--text-3xs)/1.2 var(--font-body); color:var(--text-secondary); border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:6px;`)}>
                    📅 วันที่ {formattedDate}
                  </div>

                  {/* Transactions of this day */}
                  {groupedRows[dateStr].map((t, tI) => (
                    <React.Fragment key={tI}>
                    {/* Desktop table row */}
                    <div className="audit-row-desktop" style={css(`display:grid; grid-template-columns:0.85fr 1.6fr 0.8fr 0.8fr 0.9fr 1.2fr${canManage ? ' 1fr' : ''}; gap:12px; align-items:center; padding:11px 18px; border-bottom:${tI === groupedRows[dateStr].length - 1 ? 'none' : '1px solid var(--border-subtle)'};`)}>
                      <div><span style={css(`padding:3px 9px; border-radius:var(--radius-sm); background:${t.bg}; color:${t.fg}; font:var(--fw-semibold) var(--text-2xs)/1 var(--font-body); white-space:nowrap;`)}>{t.typeLabel}</span></div>
                      <div style={css(`min-width:0;`)}>
                        <div style={css(`font:var(--fw-medium) var(--text-sm)/1.3 var(--font-body); color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`)}>{t.name}</div>
                        <div style={css(`font:var(--text-2xs)/1.3 var(--font-mono); color:var(--text-tertiary);`)}>Lot {t.lot}</div>
                      </div>
                      <div style={css(`text-align:right; font:var(--fw-bold) var(--text-sm)/1 var(--font-mono); color:${t.qtyColor};`)}>{t.qtyLabel}</div>
                      <div style={css(`font:var(--text-xs)/1.3 var(--font-body); color:var(--text-secondary);`)}>{t.scanLabel}</div>
                      <div style={css(`font:var(--text-xs)/1.3 var(--font-body); color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`)}>{t.by}</div>
                      <div style={css(`text-align:right;`)}>
                        <div style={css(`font:var(--text-2xs)/1.3 var(--font-mono); color:var(--text-secondary);`)}>{t.at.substring(11)}</div> {/* Show time part only as date is header */}
                        <div style={css(`font:var(--text-2xs)/1.3 var(--font-mono); color:var(--text-tertiary);`)}>{t.ref}</div>
                      </div>
                      {canManage && (
                        <div style={css(`display:flex; justify-content:flex-end; gap:6px;`)}>
                          {t.onPrintSticker && (
                            <button
                              type="button"
                              onClick={t.onPrintSticker}
                              style={css(`background:transparent; border:1px solid var(--border-default); border-radius:var(--radius-sm); padding:3px 8px; font:var(--text-2xs)/1.2 var(--font-body); color:var(--text-secondary); cursor:pointer; white-space:nowrap;`)}
                            >
                              🏷️ สติกเกอร์
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={t.onEdit}
                            style={css(`background:transparent; border:1px solid var(--border-default); border-radius:var(--radius-sm); padding:3px 8px; font:var(--text-2xs)/1.2 var(--font-body); color:var(--text-secondary); cursor:pointer;`)}
                          >
                            ✏️ แก้ไข
                          </button>
                          <button
                            type="button"
                            onClick={t.onDelete}
                            style={css(`background:transparent; border:1px solid var(--red-600); border-radius:var(--radius-sm); padding:3px 8px; font:var(--text-2xs)/1.2 var(--font-body); color:var(--red-600); cursor:pointer;`)}
                          >
                            🗑️ ลบ
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Mobile card row */}
                    <div className="audit-row-mobile" style={css(`flex-direction:column; gap:11px; padding:15px 16px; border-bottom:${tI === groupedRows[dateStr].length - 1 ? 'none' : '1px solid var(--border-subtle)'};`)}>
                      <div style={css(`display:flex; align-items:center; justify-content:space-between; gap:10px;`)}>
                        <span style={css(`padding:4px 11px; border-radius:var(--radius-sm); background:${t.bg}; color:${t.fg}; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body); white-space:nowrap;`)}>{t.typeLabel}</span>
                        <span style={css(`font:var(--fw-bold) var(--text-lg)/1 var(--font-mono); color:${t.qtyColor}; white-space:nowrap;`)}>{t.qtyLabel}</span>
                      </div>

                      <div>
                        <div style={css(`font:var(--fw-semibold) var(--text-sm)/1.4 var(--font-body); color:var(--text-primary);`)}>{t.name}</div>
                        <div style={css(`font:var(--text-2xs)/1.4 var(--font-mono); color:var(--text-tertiary); margin-top:3px; word-break:break-all;`)}>Lot {t.lot}</div>
                      </div>

                      <div style={css(`display:flex; flex-direction:column; gap:6px; padding-top:10px; border-top:1px dashed var(--border-subtle);`)}>
                        <div style={css(`display:flex; align-items:baseline; justify-content:space-between; gap:12px;`)}>
                          <span style={css(`font:var(--text-2xs)/1.3 var(--font-body); color:var(--text-tertiary); flex-shrink:0;`)}>วิธีระบุ</span>
                          <span style={css(`font:var(--text-xs)/1.3 var(--font-body); color:var(--text-secondary); text-align:right;`)}>{t.scanLabel}</span>
                        </div>
                        <div style={css(`display:flex; align-items:baseline; justify-content:space-between; gap:12px;`)}>
                          <span style={css(`font:var(--text-2xs)/1.3 var(--font-body); color:var(--text-tertiary); flex-shrink:0;`)}>ผู้ทำรายการ</span>
                          <span style={css(`font:var(--text-xs)/1.3 var(--font-body); color:var(--text-secondary); text-align:right;`)}>{t.by}</span>
                        </div>
                        <div style={css(`display:flex; align-items:baseline; justify-content:space-between; gap:12px;`)}>
                          <span style={css(`font:var(--text-2xs)/1.3 var(--font-body); color:var(--text-tertiary); flex-shrink:0;`)}>เวลา · อ้างอิง</span>
                          <span style={css(`font:var(--text-2xs)/1.3 var(--font-mono); color:var(--text-secondary); text-align:right;`)}>{t.at.substring(11)}{t.ref ? ` · ${t.ref}` : ''}</span>
                        </div>
                      </div>

                      {canManage && (
                        <div style={css(`display:flex; justify-content:flex-end; gap:8px; padding-top:10px; border-top:1px dashed var(--border-subtle);`)}>
                          {t.onPrintSticker && (
                            <button
                              type="button"
                              onClick={t.onPrintSticker}
                              style={css(`flex:1; background:transparent; border:1px solid var(--border-default); border-radius:var(--radius-md); padding:9px; font:var(--fw-semibold) var(--text-xs)/1.2 var(--font-body); color:var(--text-secondary); cursor:pointer; white-space:nowrap;`)}
                            >
                              🏷️ สติกเกอร์
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={t.onEdit}
                            style={css(`flex:1; background:transparent; border:1px solid var(--border-default); border-radius:var(--radius-md); padding:9px; font:var(--fw-semibold) var(--text-xs)/1.2 var(--font-body); color:var(--text-secondary); cursor:pointer;`)}
                          >
                            ✏️ แก้ไข
                          </button>
                          <button
                            type="button"
                            onClick={t.onDelete}
                            style={css(`flex:1; background:transparent; border:1px solid var(--red-600); border-radius:var(--radius-md); padding:9px; font:var(--fw-semibold) var(--text-xs)/1.2 var(--font-body); color:var(--red-600); cursor:pointer;`)}
                          >
                            🗑️ ลบ
                          </button>
                        </div>
                      )}
                    </div>
                    </React.Fragment>
                  ))}
                </div>
              );
            })
          ) : (
            <div style={css(`padding:32px 18px; text-align:center; font:var(--text-sm)/1.3 var(--font-body); color:var(--text-tertiary);`)}>
              ไม่พบประวัติธุรกรรมที่ตรงกับการค้นหาของคุณ
            </div>
          )}
        </div>
      </div>
    </>
  );
}
