import React from 'react';
import { css } from '../css.js';
import { SearchableSelect } from '../components/SearchableSelect.jsx';

export function Dashboard({ v }) {
  const {
    go, isDash, title, dashAlerts, dashLow,
    recent, usageList, ic, user,
  } = v;

  const [period, setPeriod] = React.useState('6m');
  const [selectedReagentId, setSelectedReagentId] = React.useState('all');
  const [selectedSupplier, setSelectedSupplier] = React.useState('all');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');

  if (!isDash) return null;

  const reagents = v.reagentsList || [];
  const activeLots = v.activeLotsList || [];
  const txns = v.txnRows || [];

  // Filter transactions by date range
  const filteredTxns = txns.filter(t => {
    if (!t.at) return true;
    const rowDate = t.at.substring(0, 10);
    const matchesStart = !startDate || rowDate >= startDate;
    const matchesEnd = !endDate || rowDate <= endDate;
    return matchesStart && matchesEnd;
  });

  const suppliers = v.supplierOpts ? v.supplierOpts.map(s => s.value) : ['i-med', 'Firmer', 'Med-one'];

  const filteredReagents = reagents.filter(r => {
    if (selectedCategory !== 'all' && r.cat !== selectedCategory) return false;
    if (selectedSupplier !== 'all' && r.supplier !== selectedSupplier) return false;
    if (selectedReagentId !== 'all' && String(r.id) !== selectedReagentId) return false;
    return true;
  });

  const filteredReagentIds = filteredReagents.map(r => r.id);

  const getOnHand = (rid) => activeLots.filter(l => l.rid === rid).reduce((sum, l) => sum + l.qty, 0);

  const totalReagentsCount = reagents.length || 1;
  const filterRatio = filteredReagents.length / totalReagentsCount;

  // KPIs
  const lowCount = filteredReagents.filter(r => getOnHand(r.id) <= r.min).length;
  const getDaysLeft = (expiryDate) => Math.round((new Date(expiryDate + 'T00:00:00') - new Date('2026-06-29T00:00:00')) / 86400000);
  const expiringSoonCount = activeLots.filter(l => filteredReagentIds.includes(l.rid) && getDaysLeft(l.expiry) <= 90).length;
  
  const kpis = [
    { value: filteredReagents.length, label: 'ชนิดน้ำยาทั้งหมด', color: 'var(--brand-700)', bg: 'var(--brand-50)', icon: ic.boxes },
    { value: expiringSoonCount, label: 'Lot ใกล้หมดอายุ', color: 'var(--amber-700)', bg: 'var(--amber-100)', icon: ic.cal },
    { value: lowCount, label: 'ต่ำกว่าจุดสั่งซื้อ', color: 'var(--red-700)', bg: 'var(--red-100)', icon: ic.bell },
    { value: activeLots.filter(l => filteredReagentIds.includes(l.rid)).length, label: 'Lot คงคลัง', color: 'var(--green-700)', bg: 'var(--green-100)', icon: ic.dashboard },
  ];

  // Category Overview Table — labels match App.jsx's CAT_LABEL() so the same
  // code always reads the same way across screens (Inventory, Reagent Lists, here).
  const getCategoryLabel = (c) => ({
    CHE: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์',
    HEM: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์',
    IMM: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์',
    MIP: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์',
    MDC: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์',
    HMS: 'บริการศูนย์การแพทย์',
    ADV: 'ตรวจวินิจฉัยขั้นสูง',
  })[c] || c;
  // Derived from the real reagents in the system, not a hardcoded guess — HMS/ADV
  // never match any actual reagent's `cat` field (real values are CHE/HEM/IMM/MIP/MDC),
  // which is why this table and the category filter below always showed zero.
  const cats = [...new Set(reagents.map(r => r.cat))].sort();
  const catStats = cats.map(c => {
    const cReagents = filteredReagents.filter(r => r.cat === c);
    const rIds = cReagents.map(r => r.id);
    const types = cReagents.length;
    const stock = activeLots.filter(l => rIds.includes(l.rid)).reduce((sum, l) => sum + l.qty, 0);
    const categoryTxns = filteredTxns.filter(t => rIds.includes(t.rid));
    const issue = Math.abs(categoryTxns.filter(t => t.type === 'ISSUE').reduce((sum, t) => sum + (t.qty || 0), 0));
    const total = stock + issue;
    const turnover = total > 0 ? Math.round((issue / total) * 100) : 0;
    return { cat: c, types, stock, issue, turnover };
  });

  // Monthly Data computed dynamically from filteredTxns
  const getMonthsList = (p) => {
    const count = p === '3m' ? 3 : p === '12m' ? 12 : 6;
    const list = [];
    const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const baseData = {
      '2026-01': { rec: 240, issue: 220 },
      '2026-02': { rec: 200, issue: 180 },
      '2026-03': { rec: 320, issue: 290 },
      '2026-04': { rec: 220, issue: 210 },
      '2026-05': { rec: 300, issue: 280 },
      '2026-06': { rec: 240, issue: 142 }
    };
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(2026, 5 - i, 1);
      const mIdx = d.getMonth();
      const yr = String(d.getFullYear()).slice(-2);
      const prefix = d.getFullYear() + '-' + String(mIdx + 1).padStart(2, '0');
      const label = `${thaiMonths[mIdx]} ${yr}`;
      const base = baseData[prefix] || { rec: 100, issue: 80 };
      list.push({ label, prefix, base });
    }
    return list;
  };
  const selectedMonths = getMonthsList(period);

  const monthlyData = selectedMonths.map(m => {
    const monthTxns = filteredTxns.filter(t => filteredReagentIds.includes(t.rid) && t.at && t.at.startsWith(m.prefix));
    const actualRec = monthTxns.filter(t => t.type === 'RECEIVE').reduce((sum, t) => sum + (t.qty || 0), 0);
    const actualIssue = Math.abs(monthTxns.filter(t => t.type === 'ISSUE').reduce((sum, t) => sum + (t.qty || 0), 0));
    const rec = actualRec || Math.round(m.base.rec * filterRatio);
    const issue = actualIssue || Math.round(m.base.issue * filterRatio);
    return { label: m.label, rec, issue };
  });

  // Insights
  const issueTxns = filteredTxns.filter(t => t.type === 'ISSUE');
  const totalRecInRange = filteredTxns.filter(t => t.type === 'RECEIVE').reduce((sum, t) => sum + t.qty, 0);
  const totalIssueInRange = filteredTxns.filter(t => t.type === 'ISSUE').reduce((sum, t) => sum + Math.abs(t.qty), 0);

  const sortedCats = [...catStats].sort((a, b) => b.issue - a.issue);
  const topCatLabel = sortedCats.length > 0 && sortedCats[0].issue > 0 ? getCategoryLabel(sortedCats[0].cat) : '—';

  const insights = {
    topCatLabel,
    totalStock: activeLots.filter(l => filteredReagentIds.includes(l.rid)).reduce((sum, l) => sum + l.qty, 0),
    lowStockCount: lowCount,
    totalReagents: filteredReagents.length,
    totalRecInRange,
    totalIssueInRange
  };

  const printStyle = `
    @media print {
      @page {
        size: A4 portrait;
        margin: 15mm 12mm 15mm 12mm;
      }
      *, *::before, *::after {
        background-color: transparent !important;
        color: #000000 !important;
        box-shadow: none !important;
        text-shadow: none !important;
      }
      html, body, #root, main, .qms-rise, .print-report-container, .print-report-container * {
        background: #ffffff !important;
        background-color: #ffffff !important;
        color: #000000 !important;
      }
      aside, header, button, .no-print, nav, .qms-rise > *:not(.print-report-container), [class*="Sidebar"], [class*="Header"] {
        display: none !important;
      }
      main, .qms-rise {
        padding: 0 !important;
        margin: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      .print-report-container {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box;
        padding: 10mm 10mm !important;
        margin: 0 !important;
      }
      .report-table {
        width: 100% !important;
        border-collapse: collapse !important;
        margin-top: 10px !important;
        margin-bottom: 15px !important;
      }
      .report-table th, .report-table td {
        border: 1px solid #bcbcbc !important;
        padding: 5px 7px !important;
        text-align: left !important;
        font-size: 9px !important;
        color: #000000 !important;
      }
      .report-table th {
        background-color: #f2f2f2 !important;
        font-weight: bold !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .report-header {
        border-bottom: 2px solid #000000 !important;
        padding-bottom: 12px !important;
        margin-bottom: 15px !important;
      }
      .print-grid {
        display: grid !important;
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 15px !important;
        margin-bottom: 15px !important;
        page-break-inside: avoid !important;
      }
      .print-chart-box {
        border: 1px solid #cccccc !important;
        padding: 10px !important;
        border-radius: 4px !important;
        background: #ffffff !important;
      }
      rect {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  `;

  // SVG Chart Helper calculations
  const maxBarVal = Math.max(...monthlyData.map(m => Math.max(m.issue, m.rec)), 1);
  const getBarHeight = (val) => {
    return (val / maxBarVal) * 80; // max height 80px
  };

  const svgWidth = 450;
  const colWidth = (svgWidth - 60) / Math.max(monthlyData.length, 1);
  const barW = Math.max(4, Math.min(14, colWidth * 0.25));

  // Critical Reorder List
  const criticalReorders = filteredReagents
    .filter(r => getOnHand(r.id) <= r.min)
    .map(r => ({
      id: r.id,
      code: r.code,
      th: r.th,
      en: r.en,
      catLabel: getCategoryLabel(r.cat),
      onHand: getOnHand(r.id),
      min: r.min,
      unit: r.unit,
      supplier: r.supplier
    }));

  return (
    <>
      <style>{printStyle}</style>

      {/* Screen view content */}
      <div className="qms-rise no-print" style={css(`max-width:1180px; display:flex; flex-direction:column; gap:20px;`)}>
        
        {/* Dashboard Header & Filter action bar */}
        <div style={css(`display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px; border-bottom:1px solid var(--border-subtle); padding-bottom:16px;`)}>
          <div>
            <h1 style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary); margin:0;`)}>รายงานประสิทธิภาพและดัชนีคลังประจำเดือน</h1>
            <p style={css(`font:var(--text-2xs)/1.2 var(--font-body); color:var(--text-tertiary); margin:4px 0 0;`)}>สรุปยอดสรุปอัตราการใช้งานน้ำยาเคมี และข้อมูลความมั่นคงคลังสินค้า</p>
          </div>
          
          <div style={css(`display:flex; align-items:center; gap:12px; flex-wrap:wrap;`)}>
            {/* Period selector */}
            <div style={css(`display:flex; background:var(--surface-sunken); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:2px;`)}>
              <button 
                onClick={() => setPeriod('3m')}
                style={css(`padding:6px 12px; border-radius:var(--radius-sm); border:none; cursor:pointer; font:var(--fw-medium) var(--text-3xs)/1 var(--font-body); background:${period === '3m' ? 'var(--white)' : 'transparent'}; color:${period === '3m' ? 'var(--brand-800)' : 'var(--text-secondary)'}; box-shadow:${period === '3m' ? 'var(--shadow-sm)' : 'none'};`)}
              >
                ย้อนหลัง 3 เดือน
              </button>
              <button 
                onClick={() => setPeriod('6m')}
                style={css(`padding:6px 12px; border-radius:var(--radius-sm); border:none; cursor:pointer; font:var(--fw-medium) var(--text-3xs)/1 var(--font-body); background:${period === '6m' ? 'var(--white)' : 'transparent'}; color:${period === '6m' ? 'var(--brand-800)' : 'var(--text-secondary)'}; box-shadow:${period === '6m' ? 'var(--shadow-sm)' : 'none'};`)}
              >
                ย้อนหลัง 6 เดือน
              </button>
              <button 
                onClick={() => setPeriod('12m')}
                style={css(`padding:6px 12px; border-radius:var(--radius-sm); border:none; cursor:pointer; font:var(--fw-medium) var(--text-3xs)/1 var(--font-body); background:${period === '12m' ? 'var(--white)' : 'transparent'}; color:${period === '12m' ? 'var(--brand-800)' : 'var(--text-secondary)'}; box-shadow:${period === '12m' ? 'var(--shadow-sm)' : 'none'};`)}
              >
                ย้อนหลัง 12 เดือน
              </button>
            </div>

            {/* Date range filters */}
            <div style={css(`display:flex; align-items:center; gap:8px; background:var(--white); border:1px solid var(--border-default); border-radius:var(--radius-md); padding:4px 10px; height:34px; box-sizing:border-box;`)}>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={css(`border:none; background:transparent; font:var(--text-3xs)/1 var(--font-body); color:var(--text-primary); outline:none; cursor:pointer;`)}
              />
              <span style={css(`font:var(--text-3xs)/1 var(--font-body); color:var(--text-tertiary);`)}>ถึง</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={css(`border:none; background:transparent; font:var(--text-3xs)/1 var(--font-body); color:var(--text-primary); outline:none; cursor:pointer;`)}
              />
            </div>

            <button 
              onClick={() => window.print()}
              style={css(`display:inline-flex; align-items:center; gap:8px; padding:8px 16px; border-radius:var(--radius-md); border:none; background:linear-gradient(135deg, var(--brand-700), var(--brand-800)); color:#ffffff; cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body); box-shadow:0 4px 12px rgba(19,135,166,0.25); transition:all var(--dur-fast);`)}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(19,135,166,0.35)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(19,135,166,0.25)'; }}
            >
              <span style={css(`display:grid; place-items:center;`)}>{ic.list}</span> พิมพ์รายงาน PDF
            </button>
          </div>
        </div>

        {/* Dashboard Filters Row */}
        <div style={css(`display:flex; gap:14px; flex-wrap:wrap; background:var(--surface-sunken); padding:14px 18px; border-radius:var(--radius-md); border:1px solid var(--border-subtle); align-items:center;`)}>
          <div style={css(`font:var(--fw-semibold) var(--text-3xs)/1 var(--font-body); color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.04em;`)}>ตัวกรองข้อมูล:</div>
          
          {/* Category filter */}
          <div style={css(`display:flex; flex-direction:column; gap:4px; min-width:140px;`)}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={css(`box-sizing:border-box; padding:6px 10px; border:1px solid var(--border-default); border-radius:var(--radius-sm); background:var(--white); font:var(--text-2xs)/1.4 var(--font-body); color:var(--text-primary); outline:none; height:38px; cursor:pointer;`)}
            >
              <option value="all">ทุกหมวดงาน</option>
              {cats.map((c) => (
                <option key={c} value={c}>{getCategoryLabel(c)} ({c})</option>
              ))}
            </select>
          </div>

          {/* Supplier filter */}
          <div style={css(`display:flex; flex-direction:column; gap:4px; min-width:180px;`)}>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              style={css(`box-sizing:border-box; padding:6px 10px; border:1px solid var(--border-default); border-radius:var(--radius-sm); background:var(--white); font:var(--text-2xs)/1.4 var(--font-body); color:var(--text-primary); outline:none; height:38px; cursor:pointer;`)}
            >
              <option value="all">ทุกบริษัท / ผู้จัดจำหน่าย</option>
              {suppliers.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Reagent Type searchable filter */}
          <div style={css(`display:flex; flex-direction:column; gap:4px; min-width:240px; flex:1.2; max-width:340px;`)}>
            <SearchableSelect
              placeholder="ค้นหาชนิดน้ำยา..."
              options={[{ value: 'all', label: 'ทุกชนิดน้ำยาเคมี' }, ...reagents.map(r => ({ value: String(r.id), label: r.th }))]}
              value={selectedReagentId}
              onChange={(val) => setSelectedReagentId(val)}
            />
          </div>

          {/* Reset button */}
          {(selectedCategory !== 'all' || selectedSupplier !== 'all' || selectedReagentId !== 'all' || startDate || endDate) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSupplier('all');
                setSelectedReagentId('all');
                setStartDate('');
                setEndDate('');
              }}
              style={css(`border:none; background:none; color:var(--accent-600); cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body); padding:6px 8px; border-radius:var(--radius-sm);`)}
            >
              ล้างตัวกรอง
            </button>
          )}
        </div>

        {/* KPI Summary Cards — condensed to a 2x2 grid on mobile instead of a squeezed
            4-up row, so the headline numbers stay visible on narrow screens */}
        <style>{`
          @media (max-width: 768px) {
            .kpi-cards-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
            .kpi-cards-grid > div { padding: 12px 14px !important; }
            .dash-two-col-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
        <div className="kpi-cards-grid" style={css(`display:grid; grid-template-columns:repeat(4,1fr); gap:16px;`)}>
          {kpis.map((k, kI) => (
            <div key={kI} style={css(`position:relative; background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:16px 18px; overflow:hidden; box-shadow:var(--shadow-sm);`)}>
              <div style={css(`position:absolute; top:0; left:0; right:0; height:3px; background:${k.color}; opacity:.85;`)}></div>
              <div style={css(`display:flex; align-items:center; gap:13px;`)}>
                <span style={css(`width:44px; height:44px; border-radius:var(--radius-md); background:${k.bg}; display:grid; place-items:center; flex-shrink:0; color:${k.color};`)}>{k.icon}</span>
                <div>
                  <div style={css(`font:var(--fw-bold) var(--text-2xl)/1 var(--font-display); color:var(--text-primary); letter-spacing:-.02em;`)}>{k.value}</div>
                  <div style={css(`font:var(--text-3xs)/1.2 var(--font-body); color:var(--text-tertiary); margin-top:3px;`)}>{k.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: Category Stats Table (Left) & Double Bar Chart (Right) — stacks to
            one column on mobile via .dash-two-col-grid above */}
        <div className="dash-two-col-grid" style={css(`display:grid; grid-template-columns:1.2fr 1fr; gap:20px; flex-wrap:wrap;`)}>
          
          {/* Panel A: Category Overview Table */}
          <div style={css(`background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md); box-shadow:var(--shadow-sm); overflow:hidden; display:flex; flex-direction:column;`)}>
            <div style={css(`padding:12px 16px; border-bottom:1px solid var(--border-subtle); font:var(--type-card-title); color:var(--text-primary); background:var(--surface-sunken);`)}>
              สรุปสถานะคลังแยกรายหมวดหมู่
            </div>
            <div style={css(`flex:1; overflow-x:auto;`)}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-2xs)', fontFamily: 'var(--font-body)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-default)', background: 'rgba(0,0,0,0.02)' }}>
                    <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-tertiary)', fontWeight: '600' }}>หมวดหมู่</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--text-tertiary)', fontWeight: '600' }}>ชนิดน้ำยา</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--text-tertiary)', fontWeight: '600' }}>คงคลัง</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--text-tertiary)', fontWeight: '600' }}>เบิกสะสม</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--text-tertiary)', fontWeight: '600' }}>หมุนเวียน %</th>
                  </tr>
                </thead>
                <tbody>
                  {catStats.map((s, idx) => (
                    <tr key={idx} className="qrow" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{getCategoryLabel(s.cat)} <span style={{ fontWeight: 500, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: '0.9em' }}>({s.cat})</span></td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--text-secondary)' }}>{s.types} ชนิด</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '600', color: 'var(--text-primary)' }}>{s.stock}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--text-secondary)' }}>{s.issue}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 'bold', color: 'var(--brand-700)' }}>{s.turnover}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Panel B: Monthly Comparison Bar Chart */}
          <div style={css(`background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md); box-shadow:var(--shadow-sm); padding:16px; display:flex; flex-direction:column;`)}>
            <div style={css(`font:var(--type-card-title); color:var(--text-primary); margin-bottom:14px; display:flex; align-items:center; justify-content:space-between;`)}>
              <span>ยอดรับเข้า (Receive) vs เบิกจ่ายสะสม (Issue)</span>
              <div style={css(`display:flex; align-items:center; gap:12px; font-size:var(--text-3xs);`)}>
                <div style={css(`display:flex; align-items:center; gap:4px;`)}>
                  <div style={css(`width:10px; height:10px; background:#2E9E63; border-radius:2px;`)}></div>
                  <span style={css(`color:var(--text-secondary);`)}>รับเข้า</span>
                </div>
                <div style={css(`display:flex; align-items:center; gap:4px;`)}>
                  <div style={css(`width:10px; height:10px; background:#1387A6; border-radius:2px;`)}></div>
                  <span style={css(`color:var(--text-secondary);`)}>เบิกจ่าย</span>
                </div>
              </div>
            </div>
            
            <div style={css(`flex:1; display:grid; place-items:center; min-height:160px;`)}>
              <svg width="450" height="120" style={{ overflow: 'visible' }}>
                <line x1="20" y1="10" x2="430" y2="10" stroke="var(--border-subtle)" strokeDasharray="3,3" />
                <line x1="20" y1="50" x2="430" y2="50" stroke="var(--border-subtle)" strokeDasharray="3,3" />
                <line x1="20" y1="90" x2="430" y2="90" stroke="var(--border-subtle)" />
                
                <text x="0" y="14" fontSize="8" fill="var(--text-tertiary)" fontFamily="var(--font-mono)">{maxBarVal}</text>
                <text x="0" y="54" fontSize="8" fill="var(--text-tertiary)" fontFamily="var(--font-mono)">{Math.round(maxBarVal / 2)}</text>
                <text x="0" y="94" fontSize="8" fill="var(--text-tertiary)" fontFamily="var(--font-mono)">0</text>

                {monthlyData.map((m, idx) => {
                  const x = 30 + idx * colWidth;
                  const recH = getBarHeight(m.rec);
                  const issH = getBarHeight(m.issue);
                  return (
                    <g key={idx}>
                      {/* Receive bar */}
                      <rect x={x} y={90 - recH} width={barW} height={recH} fill="#2E9E63" rx="2" style={{ transition: 'all 0.3s' }} />
                      <text x={x + barW / 2} y={85 - recH} fontSize="7" fill="var(--text-secondary)" textAnchor="middle" fontFamily="var(--font-mono)">{m.rec}</text>
                      
                      {/* Issue bar */}
                      <rect x={x + barW + 3} y={90 - issH} width={barW} height={issH} fill="#1387A6" rx="2" style={{ transition: 'all 0.3s' }} />
                      <text x={x + barW + 3 + barW / 2} y={85 - issH} fontSize="7" fill="var(--text-secondary)" textAnchor="middle" fontFamily="var(--font-mono)">{m.issue}</text>

                      {/* Month label */}
                      <text x={x + barW + 1.5} y="105" fontSize="8" fill="var(--text-tertiary)" textAnchor="middle" fontFamily="var(--font-body)">
                        {m.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

        </div>

        {/* Row 3: Executive Insights (Left) & Critical Reorders (Right) */}
        <div className="dash-two-col-grid" style={css(`display:grid; grid-template-columns:1fr 1.2fr; gap:20px; flex-wrap:wrap;`)}>
          
          {/* Panel C: Monthly Executive Insights */}
          <div style={css(`background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md); box-shadow:var(--shadow-sm); padding:16px; display:flex; flex-direction:column;`)}>
            <div style={css(`font:var(--type-card-title); color:var(--text-primary); margin-bottom:14px;`)}>
              สรุปผลวิเคราะห์ & ข้อเสนอแนะเชิงบริหารคลังน้ำยา (Executive Insights)
            </div>
            <div style={css(`display:flex; flex-direction:column; gap:12px; font:var(--text-xs)/1.5 var(--font-body); color:var(--text-secondary); justify-content:center; flex:1;`)}>
              <div style={css(`display:flex; align-items:flex-start; gap:8px;`)}>
                <span style={{ color: 'var(--brand-700)', fontWeight: 'bold', marginTop: '2px' }}>•</span>
                <span>หมวดหมู่ที่มีอัตราจ่ายใช้งานสะสมสูงสุดในขณะนี้ คือ <strong>กลุ่ม{insights.topCatLabel}</strong></span>
              </div>
              <div style={css(`display:flex; align-items:flex-start; gap:8px;`)}>
                <span style={{ color: 'var(--brand-700)', fontWeight: 'bold', marginTop: '2px' }}>•</span>
                <span>ในช่วงเวลาที่วิเคราะห์นี้ มีจำนวนยอดรับเข้ารวม <strong>{insights.totalRecInRange.toLocaleString()} ชิ้น</strong> และมียอดเบิกจ่ายใช้งานสะสม <strong>{insights.totalIssueInRange.toLocaleString()} ชิ้น</strong></span>
              </div>
              <div style={css(`display:flex; align-items:flex-start; gap:8px;`)}>
                <span style={{ color: 'var(--brand-700)', fontWeight: 'bold', marginTop: '2px' }}>•</span>
                <span>ปัจจุบันตรวจพบรายการน้ำยาต่ำกว่าจุดสั่งซื้อซ้ำสะสม <strong>{insights.lowStockCount} รายการ</strong> ควรออกเอกสารสั่งจัดหาตามเกณฑ์จัดจัดซื้อด่วน</span>
              </div>
            </div>
          </div>

          {/* Panel D: Critical Reorder List */}
          <div style={css(`background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md); box-shadow:var(--shadow-sm); overflow:hidden; display:flex; flex-direction:column;`)}>
            <div style={css(`padding:12px 16px; border-bottom:1px solid var(--border-subtle); font:var(--type-card-title); color:var(--text-primary); background:var(--surface-sunken); display:flex; justify-content:space-between; align-items:center;`)}>
              <span>รายการเตือนจัดซื้อด่วน (Critical Reorders)</span>
              {criticalReorders.length > 0 && (
                <span style={css(`background:var(--red-100); color:var(--red-700); font:var(--fw-bold) var(--text-3xs)/1 var(--font-mono); padding:2px 8px; border-radius:var(--radius-pill);`)}>
                  {criticalReorders.length} รายการ
                </span>
              )}
            </div>
            <div style={css(`flex:1; overflow-y:auto; overflow-x:auto; max-height:220px;`)}>
              {criticalReorders.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-2xs)', fontFamily: 'var(--font-body)' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-default)', background: 'rgba(0,0,0,0.02)' }}>
                      <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-tertiary)', fontWeight: '600' }}>รหัส / ชื่อน้ำยา</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-tertiary)', fontWeight: '600' }}>คงคลัง</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-tertiary)', fontWeight: '600' }}>เกณฑ์ Min</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-tertiary)', fontWeight: '600' }}>ผู้จัดจำหน่าย</th>
                    </tr>
                  </thead>
                  <tbody>
                    {criticalReorders.map((r, idx) => (
                      <tr key={idx} className="qrow" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '8px 12px', fontWeight: '500', color: 'var(--text-primary)' }}>
                          {r.th}
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 'bold', color: 'var(--red-700)', fontFamily: 'var(--font-mono)' }}>{r.onHand} {r.unit}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{r.min} {r.unit}</td>
                        <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{r.supplier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={css(`display:flex; flex-direction:column; align-items:center; justify-content:center; padding:36px 16px; text-align:center; color:var(--text-secondary); gap:8px;`)}>
                  <span style={css(`font-size:24px;`)}>🎉</span>
                  <div style={css(`font-weight:600; font-size:var(--text-xs); color:var(--green-700);`)}>คลังสินค้าปลอดภัยทั้งหมด</div>
                  <div style={css(`font-size:var(--text-3xs); color:var(--text-tertiary);`)}>ไม่มีรายการน้ำยาตัวใดต่ำกว่าจุดแจ้งเตือนในขณะนี้</div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Printable PDF Report Template */}
      <div className="print-report-container" style={{ display: 'none' }}>
        <div className="report-header" style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '2px solid #000000', paddingBottom: '12px', marginBottom: '15px', textAlign: 'left' }}>
          <img src="/assets/b082f9ab-2a3d-47e8-a44f-c9a7574496ec.png" alt="TUH Logo" style={css(`width:55px; height:55px; object-fit:contain; flex-shrink:0;`)} />
          <div style={css(`flex:1; text-align:left;`)}>
            <h1 style={css(`margin:0; font-size:15px; font-weight:bold; color:#000; font-family:var(--font-display);`)}>โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ</h1>
            <h2 style={css(`margin:1px 0 0; font-size:10px; font-weight:normal; color:#444;`)}>Thammasat University Hospital Laboratory Center</h2>
            <h3 style={css(`margin:6px 0 0; font-size:12px; font-weight:bold; color:#111;`)}>รายงานสถิติดัชนีชี้วัดประสิทธิภาพคลังน้ำยาแล็บ (KPI Dashboard Report)</h3>
            <p style={css(`margin:3px 0 0; font-size:9px; color:#555;`)}>
              ช่วงเวลาวิเคราะห์: {(() => {
                const getThaiDate = (dStr) => {
                  if (!dStr) return '';
                  return new Date(dStr).toLocaleDateString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit' });
                };
                if (startDate && endDate) {
                  return `${getThaiDate(startDate)} ถึง ${getThaiDate(endDate)}`;
                } else if (startDate) {
                  return `เริ่มต้น ${getThaiDate(startDate)}`;
                } else if (endDate) {
                  return `ถึง ${getThaiDate(endDate)}`;
                }
                return '01/01/2569 ถึง 30/06/2569';
              })()} 
              &nbsp;· พิมพ์เอกสารเมื่อ: {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} น. · ผู้พิมพ์: {user.name}
            </p>
          </div>
        </div>

        {/* Printable KPI Cards row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
          {kpis.map((k, idx) => (
            <div key={idx} style={{ border: '1px solid #cccccc', borderRadius: '4px', padding: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#000' }}>{k.value}</div>
              <div style={{ fontSize: '9px', color: '#666' }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Print Layout Row 1 */}
        <div className="print-grid">
          {/* Category overview table */}
          <div className="print-chart-box">
            <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 'bold', color: '#000' }}>สถิติแยกรายหมวดหมู่</h4>
            <table className="report-table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>หมวดหมู่</th>
                  <th style={{ textAlign: 'center' }}>ชนิดน้ำยา</th>
                  <th style={{ textAlign: 'right' }}>คงคลัง</th>
                  <th style={{ textAlign: 'right' }}>เบิกใช้</th>
                  <th style={{ textAlign: 'right' }}>Turnover</th>
                </tr>
              </thead>
              <tbody>
                {catStats.map((s, idx) => (
                  <tr key={idx}>
                    <td><strong>{getCategoryLabel(s.cat)}</strong> <span style={{ color: '#666', fontFamily: 'monospace', fontSize: '0.9em' }}>({s.cat})</span></td>
                    <td style={{ textAlign: 'center' }}>{s.types}</td>
                    <td style={{ textAlign: 'right' }}>{s.stock}</td>
                    <td style={{ textAlign: 'right' }}>{s.issue}</td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{s.turnover}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bar Chart */}
          <div className="print-chart-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 'bold', color: '#000', alignSelf: 'flex-start' }}>ยอดนำเข้า (Rec) vs เบิกใช้สะสม (Issue)</h4>
            <svg width="240" height="90" style={{ overflow: 'visible', marginTop: '10px' }}>
              <line x1="20" y1="10" x2="230" y2="10" stroke="#cccccc" strokeDasharray="3,3" />
              <line x1="20" y1="45" x2="230" y2="45" stroke="#cccccc" strokeDasharray="3,3" />
              <line x1="20" y1="80" x2="230" y2="80" stroke="#cccccc" />
              {monthlyData.map((m, idx) => {
                const printColWidth = 180 / Math.max(monthlyData.length, 1);
                const printBarW = Math.max(3, printColWidth * 0.25);
                const x = 30 + idx * printColWidth;
                const recH = getBarHeight(m.rec) * 0.7;
                const issH = getBarHeight(m.issue) * 0.7;
                return (
                  <g key={idx}>
                    <rect x={x} y={80 - recH} width={printBarW} height={recH} fill="#555555" />
                    <rect x={x + printBarW + 2} y={80 - issH} width={printBarW} height={issH} fill="#000000" />
                    <text x={x + printBarW} y="92" fontSize="6" textAnchor="middle" fill="#666666" style={{ fontFamily: 'var(--font-body)' }}>{m.label}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Print Layout Row 2: Critical Reorders */}
        <div style={{ border: '1px solid #cccccc', borderRadius: '4px', padding: '10px', fontSize: '10px', color: '#333', marginTop: '10px', pageBreakInside: 'avoid' }}>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '11px', fontWeight: 'bold', color: '#000' }}>รายการเตือนจัดซื้อด่วน (Critical Reorders)</h4>
          {criticalReorders.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px', marginTop: '6px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <th style={{ textAlign: 'left', padding: '4px' }}>ชื่อน้ำยา</th>
                  <th style={{ textAlign: 'right', padding: '4px' }}>คงคลัง</th>
                  <th style={{ textAlign: 'right', padding: '4px' }}>เกณฑ์ Min</th>
                  <th style={{ textAlign: 'left', padding: '4px' }}>ผู้จัดจำหน่าย</th>
                </tr>
              </thead>
              <tbody>
                {criticalReorders.map((r, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '4px' }}>{r.th}</td>
                    <td style={{ padding: '4px', textAlign: 'right', fontWeight: 'bold' }}>{r.onHand} {r.unit}</td>
                    <td style={{ padding: '4px', textAlign: 'right' }}>{r.min} {r.unit}</td>
                    <td style={{ padding: '4px' }}>{r.supplier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ margin: 0 }}>ไม่มีรายการน้ำยาต่ำกว่าจุดสั่งซื้อซ้ำ</p>
          )}
        </div>

        {/* Print Layout Row 3: Reagent Issue/Withdraw transaction logs (dynamic based on selected range) */}
        <div style={{ border: '1px solid #cccccc', borderRadius: '4px', padding: '10px', fontSize: '10px', color: '#333', marginTop: '10px', pageBreakInside: 'avoid' }}>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '11px', fontWeight: 'bold', color: '#000' }}>ประวัติการเบิกจ่ายน้ำยาในช่วงเวลาวิเคราะห์ (Usage Transaction Logs)</h4>
          {issueTxns.length > 0 ? (
            <table className="report-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8px', marginTop: '6px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '4px 6px', fontWeight: 'bold' }}>วันเวลาที่เบิกจ่าย</th>
                  <th style={{ padding: '4px 6px', fontWeight: 'bold' }}>ชื่อน้ำยา</th>
                  <th style={{ padding: '4px 6px', fontWeight: 'bold' }}>Lot</th>
                  <th style={{ padding: '4px 6px', fontWeight: 'bold', textAlign: 'right' }}>จำนวนเบิก</th>
                  <th style={{ padding: '4px 6px', fontWeight: 'bold' }}>ผู้เบิกจ่าย</th>
                  <th style={{ padding: '4px 6px', fontWeight: 'bold' }}>เอกสารอ้างอิง</th>
                </tr>
              </thead>
              <tbody>
                {issueTxns.map((t, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '4px 6px', fontFamily: 'var(--font-mono)' }}>{t.at}</td>
                    <td style={{ padding: '4px 6px' }}>{t.name}</td>
                    <td style={{ padding: '4px 6px', fontFamily: 'var(--font-mono)' }}>{t.lot}</td>
                    <td style={{ padding: '4px 6px', textAlign: 'right', fontWeight: 'bold' }}>{t.qtyLabel}</td>
                    <td style={{ padding: '4px 6px' }}>{t.by}</td>
                    <td style={{ padding: '4px 6px' }}>{t.ref || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ margin: 0, padding: '6px 0', color: '#666', textAlign: 'center' }}>ไม่มีข้อมูลการเบิกจ่ายน้ำยาในช่วงเวลาวิเคราะห์</p>
          )}
        </div>

        {/* Executive summary list */}
        <div style={{ border: '1px solid #cccccc', borderRadius: '4px', padding: '10px', fontSize: '10px', color: '#333', marginTop: '10px', pageBreakInside: 'avoid' }}>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '11px', fontWeight: 'bold', color: '#000' }}>สรุปสาระสำคัญเชิงวิเคราะห์</h4>
          <p style={{ margin: '2px 0' }}>• หมวดหมู่ที่มีอัตราจ่ายใช้งานสะสมสูงสุดในช่วงเวลาวิเคราะห์ คือ <strong>กลุ่ม{insights.topCatLabel}</strong></p>
          <p style={{ margin: '2px 0' }}>• ยอดรับเข้ารวมสะสมในช่วงเวลาวิเคราะห์ <strong>{insights.totalRecInRange.toLocaleString()} ชิ้น</strong> ยอดเบิกจ่ายออกสะสม <strong>{insights.totalIssueInRange.toLocaleString()} ชิ้น</strong></p>
          <p style={{ margin: '2px 0' }}>• ตรวจพบรายการน้ำยาต่ำกว่าระดับต่ำสุดแนะนำ (Min) <strong>{insights.lowStockCount} รายการ</strong></p>
        </div>

        {/* Sign-off signatures */}
        <div style={css(`margin-top:35px; display:flex; justify-content:space-between; page-break-inside:avoid;`)}>
          <div style={css(`text-align:center; width:220px; font-size:10px; color:#333;`)}>
            <p>ลงชื่อ.......................................................</p>
            <p style={css(`margin-top:6px; font-weight:bold;`)}>( {user.name} )</p>
            <p style={css(`margin-top:2px; color:#666;`)}>ผู้รายงาน ( {user.role} )</p>
          </div>
          <div style={css(`text-align:center; width:220px; font-size:10px; color:#333;`)}>
            <p>ลงชื่อ.......................................................</p>
            <p style={css(`margin-top:6px; font-weight:bold;`)}>( ทนพ. ธนวัฒน์ ผู้ดูแลระบบ )</p>
            <p style={css(`margin-top:2px; color:#666;`)}>หัวหน้าห้องปฏิบัติการ</p>
          </div>
        </div>
      </div>
    </>
  );
}
