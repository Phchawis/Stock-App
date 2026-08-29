import React from 'react';
import { css } from '../css.js';

// Safety Data Sheet viewer.
//
// The sheet is shown inside the app rather than sent to a new tab, so someone
// checking a hazard at the bench does not lose their place in the inventory.
// Google will refuse to embed a file that is not shared for viewing, and an
// iframe that fails does so silently — a blank white box with no explanation.
// So the frame always sits above an escape hatch: an "open in Drive" link and a
// plain statement of what to do when nothing appears.
export function SdsModal({ v }) {
  const { stop, modalSds, closeSds, sdsData, sdsFolderUrl } = v;

  if (!modalSds || !sdsData) return null;

  const { reagentName, file, url } = sdsData;

  // Drive's /preview form is the one meant for embedding; a normal /view link
  // renders the whole Drive UI and is usually refused inside a frame.
  const embedUrl = (() => {
    if (!url) return '';
    const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
    return url;
  })();

  return (
    // z-index sits above every other overlay on purpose: this viewer is opened
    // *from* the reagent detail dialog (z-index 100), so anything lower opens
    // invisibly behind the dialog that launched it.
    <div className="ov-in" onClick={closeSds}
      style={css(`position:fixed; inset:0; background:rgba(8,20,28,.62); z-index:120; display:grid; place-items:center; padding:20px;`)}>
      <div className="tt-in" onClick={stop}
        style={css(`width:min(920px,96vw); height:min(88vh,900px); background:var(--surface-card); border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); border:1px solid var(--border-subtle); display:flex; flex-direction:column; overflow:hidden;`)}>

        <div style={css(`padding:16px 20px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:12px; flex-shrink:0;`)}>
          <span style={css(`width:34px; height:34px; border-radius:var(--radius-md); background:var(--amber-100); color:var(--amber-700); display:grid; place-items:center; font-size:17px;`)}>⚠️</span>
          <div style={css(`flex:1; min-width:0;`)}>
            <div style={css(`font:var(--fw-bold) var(--text-base)/1.2 var(--font-display); color:var(--text-primary);`)}>
              เอกสารความปลอดภัย (SDS)
            </div>
            <div style={css(`font:var(--text-2xs)/1.4 var(--font-body); color:var(--text-tertiary); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;`)}>
              {reagentName} · {file || 'ยังไม่ระบุชื่อไฟล์'}
            </div>
          </div>
          {url && (
            <a href={url} target="_blank" rel="noopener noreferrer"
              style={css(`padding:8px 14px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:transparent; color:var(--text-secondary); text-decoration:none; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body); white-space:nowrap;`)}>
              เปิดใน Drive ↗
            </a>
          )}
          <button onClick={closeSds}
            style={css(`border:none; background:var(--slate-100); cursor:pointer; padding:7px 11px; border-radius:var(--radius-sm); color:var(--text-secondary); font:var(--fw-semibold) var(--text-xs)/1 var(--font-body);`)}>
            ปิด
          </button>
        </div>

        {url ? (
          <>
            <iframe
              src={embedUrl}
              title={`SDS ${reagentName}`}
              style={css(`flex:1; width:100%; border:none; background:var(--slate-50);`)}
            />
            <div style={css(`padding:9px 20px; border-top:1px solid var(--border-subtle); background:var(--slate-50); font:var(--text-3xs)/1.5 var(--font-body); color:var(--text-tertiary); flex-shrink:0;`)}>
              หากเอกสารไม่ขึ้น แปลว่าไฟล์ยังไม่ได้ตั้งค่าแชร์เป็น “ทุกคนที่มีลิงก์ดูได้” — กด “เปิดใน Drive” ด้านบนเพื่อดูโดยตรง
            </div>
          </>
        ) : (
          <div style={css(`flex:1; display:grid; place-items:center; padding:28px; text-align:center;`)}>
            <div style={css(`max-width:46ch; display:flex; flex-direction:column; gap:12px; align-items:center;`)}>
              <span style={css(`font-size:34px;`)}>📄</span>
              <div style={css(`font:var(--fw-semibold) var(--text-sm)/1.5 var(--font-body); color:var(--text-primary);`)}>
                {file ? 'ยังไม่ได้ใส่ลิงก์ของไฟล์นี้' : 'น้ำยาตัวนี้ยังไม่มีเอกสาร SDS'}
              </div>
              {file && (
                <div style={css(`font:var(--text-xs)/1.6 var(--font-body); color:var(--text-secondary);`)}>
                  ชื่อไฟล์ในทะเบียน MSDS คือ<br />
                  <strong style={css(`font-family:var(--font-mono);`)}>{file}</strong>
                </div>
              )}
              {sdsFolderUrl ? (
                <a href={sdsFolderUrl} target="_blank" rel="noopener noreferrer"
                  style={css(`margin-top:4px; padding:9px 16px; border-radius:var(--radius-md); background:var(--accent-600); color:#fff; text-decoration:none; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body);`)}>
                  เปิดโฟลเดอร์ SDS ใน Drive ↗
                </a>
              ) : (
                <div style={css(`font:var(--text-2xs)/1.6 var(--font-body); color:var(--text-tertiary);`)}>
                  ผู้ดูแลระบบสามารถวางลิงก์ Drive ของไฟล์นี้ได้จากหน้าแก้ไขน้ำยา
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
