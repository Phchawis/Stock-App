import React from 'react';

/** Lot counts, not mixed reagent quantities. Always independent of report filters. */
export function StockOverview({ v }) {
  const rows = v.expiryOverview || [];
  const total = rows.reduce((sum, row) => sum + row.count, 0);
  return (
    <section className="stock-overview" aria-labelledby="stock-overview-title">
      <div className="stock-overview-heading">
        <div>
          <h2 id="stock-overview-title">อายุล็อตในคลัง</h2>
          <p>ภาพรวมทุกหมวด · เฉพาะล็อตที่มีน้ำยาคงเหลือ</p>
        </div>
        <button onClick={v.go.inventory} className="overview-link">ดูคลังน้ำยา <span aria-hidden="true">↗</span></button>
      </div>
      {total ? <>
        <div className="expiry-track" role="img" aria-label={rows.map(r => `${r.label} ${r.count} ล็อต`).join(' · ')}>
          {rows.filter(r => r.count > 0).map(r => <span key={r.tone} className={`expiry-segment ${r.tone}`} style={{ flex: r.count }} />)}
        </div>
        <div className="expiry-legend">
          {rows.map(row => <div key={row.tone} className="expiry-item">
            <div className="expiry-label"><i className={row.tone} aria-hidden="true" />{row.label}</div>
            <div className="expiry-value">{row.count.toLocaleString('th-TH')} <span>ล็อต</span></div>
            <p>{row.detail}</p>
          </div>)}
        </div>
      </> : <p className="overview-empty">ยังไม่มีล็อตคงเหลือ รับเข้าน้ำยาเพื่อเริ่มติดตามอายุล็อต</p>}
      <div className="fefo-note"><span className="fefo-mark">FEFO</span><span>เบิกล็อตที่หมดอายุก่อน ตามแผนเบิกจ่ายของระบบ</span><button onClick={v.go.alerts}>ดูการแจ้งเตือน →</button></div>
    </section>
  );
}
