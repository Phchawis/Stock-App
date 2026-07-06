import React from 'react';
import { css } from '../css.js';

export function CreateStickerForm({ v }) {
  const { isCreateSticker, reagentsList, user } = v;

  if (!isCreateSticker) return null;

  const [activeTab, setActiveTab] = React.useState('aliquot'); // 'aliquot' or 'opened'
  const canvasRef = React.useRef(null);

  // Form 1: Aliquot Form State
  const [aliquotReagent, setAliquotReagent] = React.useState('');
  const [aliquotLot, setAliquotLot] = React.useState('');
  const [aliquotPrepDate, setAliquotPrepDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [aliquotExpDate, setAliquotExpDate] = React.useState('');
  const [aliquotPrepBy, setAliquotPrepBy] = React.useState(user ? user.name.split(' ')[0] : '');

  // Form 2: Opened Form State
  const [openedReagent, setOpenedReagent] = React.useState('');
  const [openedType, setOpenedType] = React.useState('Control'); // 'Control' or 'Calibrator'
  const [openedDate, setOpenedDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [openedBy, setOpenedBy] = React.useState(user ? user.name.split(' ')[0] : '');
  const [openStorageDuration, setOpenStorageDuration] = React.useState('Until exp.');

  // Render preview canvas in real time
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'alphabetic';

    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      const [y, m, d] = dateStr.split('-');
      if (!y || !m || !d) return dateStr;
      return `${d}/${m}/${y}`;
    };

    if (activeTab === 'aliquot') {
      // Dimension 2x3 cm -> W:600px, H:400px (scale = 20)
      canvas.width = 600;
      canvas.height = 400;

      // Draw background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 600, 400);

      // Draw border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, 580, 380);

      ctx.fillStyle = '#000000';

      const labelFont = "bold 32px 'Sarabun', sans-serif";
      const valFont = "30px 'Sarabun', sans-serif";

      // Row 1: ชื่อน้ำยา
      ctx.font = labelFont;
      ctx.fillText("ชื่อน้ำยา", 30, 80);
      ctx.font = valFont;
      ctx.fillText(aliquotReagent || '', 160, 80);
      ctx.font = "bold 30px sans-serif";
      ctx.fillText("....................................................", 160, 85);

      // Row 2: Lot.
      ctx.font = labelFont;
      ctx.fillText("Lot.", 30, 150);
      ctx.font = valFont;
      ctx.fillText(aliquotLot || '', 110, 150);
      ctx.font = "bold 30px sans-serif";
      ctx.fillText("......................................................", 110, 155);

      // Row 3: วันที่เตรียม
      ctx.font = labelFont;
      ctx.fillText("วันที่เตรียม", 30, 220);
      ctx.font = valFont;
      ctx.fillText(formatDate(aliquotPrepDate), 195, 220);
      ctx.font = "bold 30px sans-serif";
      ctx.fillText("........../........../................", 195, 225);

      // Row 4: วัน: Exp.
      ctx.font = labelFont;
      ctx.fillText("วัน: Exp.", 30, 290);
      ctx.font = valFont;
      ctx.fillText(formatDate(aliquotExpDate), 185, 290);
      ctx.font = "bold 30px sans-serif";
      ctx.fillText("........../........../................", 185, 295);

      // Row 5: ชื่อผู้เตรียม
      ctx.font = labelFont;
      ctx.fillText("ชื่อผู้เตรียม", 30, 360);
      ctx.font = valFont;
      ctx.fillText(aliquotPrepBy || '', 195, 360);
      ctx.font = "bold 30px sans-serif";
      ctx.fillText(".......................................", 195, 365);

    } else {
      // Dimension 2x4 cm -> W:800px, H:400px (scale = 20)
      canvas.width = 800;
      canvas.height = 400;

      // Draw background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 800, 400);

      // Draw rounded border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(15, 15, 770, 370, 16);
      ctx.stroke();

      ctx.fillStyle = '#000000';

      const labelFont = "bold 36px 'Sarabun', sans-serif";
      const valFont = "36px 'Sarabun', sans-serif";

      // Row 1: HBsAg Qualitative Control (Reagent + Type)
      const titleText = `${openedReagent || ''} ${openedType}`;
      ctx.font = labelFont;
      ctx.fillText(titleText, 40, 95);

      // Row 2: Opened: __ / __ / __ by ___
      ctx.fillText("Opened: ", 40, 205);
      ctx.font = valFont;
      ctx.fillText(formatDate(openedDate), 195, 205);
      ctx.fillText("_______/_______/_______", 195, 210);

      ctx.font = labelFont;
      ctx.fillText("by", 475, 205);
      ctx.font = valFont;
      ctx.fillText(openedBy || '', 530, 205);
      ctx.fillText("__________________", 530, 210);

      // Row 3: After open storage 2-8 °C = Until exp.
      ctx.font = labelFont;
      const storageText = `After open storage 2-8 °C = ${openStorageDuration}`;
      ctx.fillText(storageText, 40, 315);
    }
  }, [
    activeTab,
    aliquotReagent, aliquotLot, aliquotPrepDate, aliquotExpDate, aliquotPrepBy,
    openedReagent, openedType, openedDate, openedBy, openStorageDuration
  ]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = activeTab === 'aliquot' ? 'Aliquot_Sticker.png' : 'Opened_Sticker.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    // Set width and height based on chosen size in cm
    const wCm = activeTab === 'aliquot' ? 3 : 4;
    const hCm = 2;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Sticker</title>
          <style>
            @page {
              size: ${wCm}cm ${hCm}cm;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              background-color: #fff;
            }
            img {
              width: ${wCm}cm;
              height: ${hCm}cm;
              display: block;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <img src="${dataUrl}" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="qms-rise" style={css(`max-width:1100px; display:flex; flex-direction:column; gap:20px;`)}>
      {/* Title & Tabs Card */}
      <div style={css(`background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:20px 24px; box-shadow:var(--shadow-sm); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;`)}>
        <div>
          <h2 style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary); margin:0; display:flex; align-items:center; gap:8px;`)}>
            <span>🏷️</span> สร้างสติกเกอร์ (Sticker Generator)
          </h2>
          <p style={css(`font:var(--text-2xs)/1.4 var(--font-body); color:var(--text-tertiary); margin:4px 0 0 0;`)}>
            สร้างสติกเกอร์สำหรับขวดทดสอบน้ำยาแบ่งส่วน (Aliquot) และขวดเปิดใช้งาน (Opened) พร้อมดาวน์โหลดไฟล์ PNG หรือสั่งพิมพ์ออกเครื่องพิมพ์สติกเกอร์ความร้อน
          </p>
        </div>

        {/* Tab Buttons */}
        <div style={css(`display:flex; background:var(--surface-sunken); padding:4px; border-radius:var(--radius-md); border:1px solid var(--border-subtle);`)}>
          <button 
            onClick={() => setActiveTab('aliquot')}
            style={css(`padding:8px 16px; border-radius:var(--radius-sm); border:none; background:${activeTab === 'aliquot' ? 'var(--brand-700)' : 'transparent'}; color:${activeTab === 'aliquot' ? '#fff' : 'var(--text-secondary)'}; cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body); transition:all var(--dur-fast);`)}
          >
            Aliquot Sticker Form (3x2 cm)
          </button>
          <button 
            onClick={() => setActiveTab('opened')}
            style={css(`padding:8px 16px; border-radius:var(--radius-sm); border:none; background:${activeTab === 'opened' ? 'var(--brand-700)' : 'transparent'}; color:${activeTab === 'opened' ? '#fff' : 'var(--text-secondary)'}; cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body); transition:all var(--dur-fast);`)}
          >
            Opened Sticker Form (4x2 cm)
          </button>
        </div>
      </div>

      {/* Main Form & Preview Grid */}
      <div style={css(`display:grid; grid-template-columns:repeat(auto-fit, minmax(360px, 1fr)); gap:20px; align-items:start;`)}>
        {/* Form Inputs Column */}
        <div style={css(`background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:24px; display:flex; flex-direction:column; gap:16px; box-shadow:var(--shadow-sm);`)}>
          <h3 style={css(`font:var(--fw-bold) var(--text-base)/1.2 var(--font-display); color:var(--text-primary); border-bottom:1px solid var(--border-subtle); padding-bottom:10px; margin:0;`)}>
            {activeTab === 'aliquot' ? 'ข้อมูลขวดแบ่งส่วน (Aliquot Details)' : 'ข้อมูลการเปิดขวดใช้งาน (Opened Reagent Details)'}
          </h3>

          {activeTab === 'aliquot' ? (
            <>
              {/* Aliquot Reagent Select */}
              <div style={css(`display:flex; flex-direction:column; gap:6px;`)}>
                <label style={css(`font-size:var(--text-2xs); font-weight:600; color:var(--text-secondary);`)}>ชื่อน้ำยาเคมี</label>
                <select 
                  value={aliquotReagent}
                  onChange={(e) => setAliquotReagent(e.target.value)}
                  style={css(`box-sizing:border-box; width:100%; padding:10px; border:1px solid var(--border-default); border-radius:var(--radius-md); background:var(--white); color:var(--text-primary); font-size:var(--text-xs); font-family:var(--font-body); outline:none; height:42px; cursor:pointer;`)}
                >
                  <option value="">-- เลือกน้ำยาจากฐานข้อมูล หรือพิมพ์ด้านล่าง --</option>
                  {reagentsList.map(r => (
                    <option key={r.id} value={r.th}>{r.th} ({r.en})</option>
                  ))}
                </select>
                <input 
                  type="text" 
                  placeholder="หรือพิมพ์ชื่อน้ำยาอื่นๆ..."
                  value={aliquotReagent}
                  onChange={(e) => setAliquotReagent(e.target.value)}
                  style={css(`box-sizing:border-box; width:100%; padding:10px 14px; border:1px solid var(--border-default); border-radius:var(--radius-md); background:var(--white); color:var(--text-primary); font-size:var(--text-xs); font-family:var(--font-body); outline:none;`)}
                />
              </div>

              {/* Lot Number */}
              <div style={css(`display:flex; flex-direction:column; gap:6px;`)}>
                <label style={css(`font-size:var(--text-2xs); font-weight:600; color:var(--text-secondary);`)}>เลข Lot</label>
                <input 
                  type="text" 
                  placeholder="เช่น LOT2026-A"
                  value={aliquotLot}
                  onChange={(e) => setAliquotLot(e.target.value)}
                  style={css(`box-sizing:border-box; width:100%; padding:10px 14px; border:1px solid var(--border-default); border-radius:var(--radius-md); background:var(--white); color:var(--text-primary); font-size:var(--text-xs); font-family:var(--font-body); outline:none;`)}
                />
              </div>

              {/* Prepared Date */}
              <div style={css(`display:flex; flex-direction:column; gap:6px;`)}>
                <label style={css(`font-size:var(--text-2xs); font-weight:600; color:var(--text-secondary);`)}>วันที่เตรียม (Prepared Date)</label>
                <input 
                  type="date" 
                  value={aliquotPrepDate}
                  onChange={(e) => setAliquotPrepDate(e.target.value)}
                  style={css(`box-sizing:border-box; width:100%; padding:10px 14px; border:1px solid var(--border-default); border-radius:var(--radius-md); background:var(--white); color:var(--text-primary); font-size:var(--text-xs); font-family:var(--font-body); outline:none; cursor:pointer;`)}
                />
              </div>

              {/* Expiry Date */}
              <div style={css(`display:flex; flex-direction:column; gap:6px;`)}>
                <label style={css(`font-size:var(--text-2xs); font-weight:600; color:var(--text-secondary);`)}>วัน Exp. (Expiry Date)</label>
                <input 
                  type="date" 
                  value={aliquotExpDate}
                  onChange={(e) => setAliquotExpDate(e.target.value)}
                  style={css(`box-sizing:border-box; width:100%; padding:10px 14px; border:1px solid var(--border-default); border-radius:var(--radius-md); background:var(--white); color:var(--text-primary); font-size:var(--text-xs); font-family:var(--font-body); outline:none; cursor:pointer;`)}
                />
              </div>

              {/* Prepared By */}
              <div style={css(`display:flex; flex-direction:column; gap:6px;`)}>
                <label style={css(`font-size:var(--text-2xs); font-weight:600; color:var(--text-secondary);`)}>ชื่อผู้เตรียม</label>
                <input 
                  type="text" 
                  placeholder="ชื่อผู้เตรียม..."
                  value={aliquotPrepBy}
                  onChange={(e) => setAliquotPrepBy(e.target.value)}
                  style={css(`box-sizing:border-box; width:100%; padding:10px 14px; border:1px solid var(--border-default); border-radius:var(--radius-md); background:var(--white); color:var(--text-primary); font-size:var(--text-xs); font-family:var(--font-body); outline:none;`)}
                />
              </div>
            </>
          ) : (
            <>
              {/* Opened Reagent Select */}
              <div style={css(`display:flex; flex-direction:column; gap:6px;`)}>
                <label style={css(`font-size:var(--text-2xs); font-weight:600; color:var(--text-secondary);`)}>ชื่อน้ำยาเคมี</label>
                <select 
                  value={openedReagent}
                  onChange={(e) => setOpenedReagent(e.target.value)}
                  style={css(`box-sizing:border-box; width:100%; padding:10px; border:1px solid var(--border-default); border-radius:var(--radius-md); background:var(--white); color:var(--text-primary); font-size:var(--text-xs); font-family:var(--font-body); outline:none; height:42px; cursor:pointer;`)}
                >
                  <option value="">-- เลือกน้ำยาจากฐานข้อมูล หรือพิมพ์ด้านล่าง --</option>
                  {reagentsList.map(r => (
                    <option key={r.id} value={r.th}>{r.th} ({r.en})</option>
                  ))}
                </select>
                <input 
                  type="text" 
                  placeholder="หรือพิมพ์ชื่อน้ำยาอื่นๆ..."
                  value={openedReagent}
                  onChange={(e) => setOpenedReagent(e.target.value)}
                  style={css(`box-sizing:border-box; width:100%; padding:10px 14px; border:1px solid var(--border-default); border-radius:var(--radius-md); background:var(--white); color:var(--text-primary); font-size:var(--text-xs); font-family:var(--font-body); outline:none;`)}
                />
              </div>

              {/* Type Dropdown (Control / Calibrator) */}
              <div style={css(`display:flex; flex-direction:column; gap:6px;`)}>
                <label style={css(`font-size:var(--text-2xs); font-weight:600; color:var(--text-secondary);`)}>ประเภทตัวควบคุม (Type)</label>
                <select 
                  value={openedType}
                  onChange={(e) => setOpenedType(e.target.value)}
                  style={css(`box-sizing:border-box; width:100%; padding:10px; border:1px solid var(--border-default); border-radius:var(--radius-md); background:var(--white); color:var(--text-primary); font-size:var(--text-xs); font-family:var(--font-body); outline:none; height:42px; cursor:pointer;`)}
                >
                  <option value="Control">Control</option>
                  <option value="Calibrator">Calibrator</option>
                </select>
              </div>

              {/* Opened Date */}
              <div style={css(`display:flex; flex-direction:column; gap:6px;`)}>
                <label style={css(`font-size:var(--text-2xs); font-weight:600; color:var(--text-secondary);`)}>วันที่เปิดขวดใช้งาน (Opened Date)</label>
                <input 
                  type="date" 
                  value={openedDate}
                  onChange={(e) => setOpenedDate(e.target.value)}
                  style={css(`box-sizing:border-box; width:100%; padding:10px 14px; border:1px solid var(--border-default); border-radius:var(--radius-md); background:var(--white); color:var(--text-primary); font-size:var(--text-xs); font-family:var(--font-body); outline:none; cursor:pointer;`)}
                />
              </div>

              {/* Opened By */}
              <div style={css(`display:flex; flex-direction:column; gap:6px;`)}>
                <label style={css(`font-size:var(--text-2xs); font-weight:600; color:var(--text-secondary);`)}>ผู้เปิดขวด (by)</label>
                <input 
                  type="text" 
                  placeholder="ชื่อผู้เปิดขวด..."
                  value={openedBy}
                  onChange={(e) => setOpenedBy(e.target.value)}
                  style={css(`box-sizing:border-box; width:100%; padding:10px 14px; border:1px solid var(--border-default); border-radius:var(--radius-md); background:var(--white); color:var(--text-primary); font-size:var(--text-xs); font-family:var(--font-body); outline:none;`)}
                />
              </div>

              {/* Storage Expiration Dropdown */}
              <div style={css(`display:flex; flex-direction:column; gap:6px;`)}>
                <label style={css(`font-size:var(--text-2xs); font-weight:600; color:var(--text-secondary);`)}>วันหมดอายุหลังเปิด (After open storage 2-8 °C =)</label>
                <select 
                  value={openStorageDuration}
                  onChange={(e) => setOpenStorageDuration(e.target.value)}
                  style={css(`box-sizing:border-box; width:100%; padding:10px; border:1px solid var(--border-default); border-radius:var(--radius-md); background:var(--white); color:var(--text-primary); font-size:var(--text-xs); font-family:var(--font-body); outline:none; height:42px; cursor:pointer;`)}
                >
                  <option value="7 days">7 days</option>
                  <option value="14 days">14 days</option>
                  <option value="30 days">30 days</option>
                  <option value="Until exp.">Until exp.</option>
                </select>
              </div>
            </>
          )}
        </div>

        {/* Live Preview & Actions Column */}
        <div style={css(`background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:24px; display:flex; flex-direction:column; gap:20px; box-shadow:var(--shadow-sm); align-items:center;`)}>
          <h3 style={css(`font:var(--fw-bold) var(--text-base)/1.2 var(--font-display); color:var(--text-primary); border-bottom:1px solid var(--border-subtle); padding-bottom:10px; margin:0; width:100%; text-align:left;`)}>
            ตัวอย่างสติกเกอร์ (Live Preview)
          </h3>

          {/* Canvas Wrapper */}
          <div style={css(`padding:10px; background:#e2ecf0; border-radius:var(--radius-md); border:1px solid var(--border-default); display:flex; align-items:center; justify-content:center; max-width:100%; overflow:auto;`)}>
            <canvas 
              ref={canvasRef} 
              style={css(`background:#ffffff; border:1px solid #999; box-shadow:0 4px 8px rgba(0,0,0,0.1); width:${activeTab === 'aliquot' ? '300px' : '400px'}; height:200px; display:block;`)}
            />
          </div>

          <div style={css(`font:var(--text-3xs)/1.4 var(--font-body); color:var(--text-tertiary); max-width:320px; text-align:center;`)}>
            สติกเกอร์จะถูกแสดงผลด้วยอัตราส่วนที่ถูกต้อง คุณสามารถดาวน์โหลดเป็นไฟล์รูปภาพ PNG หรือสั่งพิมพ์ออกทางเครื่องพิมพ์สติกเกอร์ความร้อนโดยตรง
          </div>

          {/* Buttons */}
          <div style={css(`display:flex; gap:12px; width:100%; justify-content:center; flex-wrap:wrap;`)}>
            <button 
              onClick={handleDownload}
              style={css(`display:inline-flex; align-items:center; gap:8px; padding:12px 20px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--white); color:var(--text-secondary); cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body); transition:all var(--dur-fast);`)}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
            >
              📥 ดาวน์โหลดไฟล์ PNG
            </button>
            <button 
              onClick={handlePrint}
              style={css(`display:inline-flex; align-items:center; gap:8px; padding:12px 24px; border-radius:var(--radius-md); border:none; background:var(--brand-700); color:#fff; cursor:pointer; font:var(--fw-bold) var(--text-sm)/1 var(--font-body); box-shadow:var(--glow-brand-soft); transition:all var(--dur-fast);`)}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.background = 'var(--brand-800)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = 'var(--brand-700)'; }}
            >
              🖨️ สั่งพิมพ์สติกเกอร์
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
