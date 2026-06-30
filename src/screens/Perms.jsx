import React from 'react';
import { css } from '../css.js';

export function Perms({ v }) {
  const {
    canEditPerms, permRoles, permRows, myRole, isPerms,
    canAddUser, usersList, openAddUser, deleteUser, user,
  } = v;

  if (!isPerms) return null;

  // Only Admin has the privilege to delete users
  const isAdmin = user && user.roleId === 'admin';

  return (
    <div className="qms-rise" style={css(`max-width:1080px; display:flex; flex-direction:column; gap:20px;`)}>
      
      {/* Active Role card */}
      <div style={css(`display:flex; align-items:center; gap:16px; padding:18px 20px; background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md); box-shadow:var(--shadow-sm);`)}>
        <span style={css(`width:48px; height:48px; border-radius:50%; background:${myRole.color}; color:#fff; display:grid; place-items:center; font:600 16px/1 var(--font-body); flex-shrink:0;`)}>{myRole.initials}</span>
        <div style={css(`flex:1; min-width:0;`)}>
          <div style={css(`font:var(--text-2xs)/1.3 var(--font-body); color:var(--text-tertiary);`)}>บทบาทที่เข้าสู่ระบบขณะนี้</div>
          <div style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary);`)}>{myRole.th} <span style={css(`font:500 12px/1 var(--font-mono); color:var(--text-tertiary);`)}>{myRole.en}</span></div>
        </div>
        <span style={css(`padding:6px 13px; border-radius:var(--radius-pill); background:var(--green-100); color:var(--green-700); font:var(--fw-semibold) var(--text-xs)/1 var(--font-body); white-space:nowrap;`)}>เข้าถึง {myRole.grantCount} / 7 สิทธิ์</span>
      </div>

      {canEditPerms && (
        <div style={css(`display:flex; align-items:center; gap:10px; padding:12px 16px; border-radius:var(--radius-md); background:var(--brand-50); border:1px solid var(--brand-100); font:var(--fw-medium) var(--text-sm)/1.5 var(--font-body); color:var(--brand-800);`)}>
          โหมดผู้ดูแลระบบ · คลิกที่ช่อง ✓ / ✗ ในตารางเพื่อเพิ่มหรือลบสิทธิ์ของแต่ละบทบาท
        </div>
      )}

      {/* Permissions Matrix */}
      <div style={css(`background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md); box-shadow:var(--shadow-sm); overflow:hidden;`)}>
        <div style={css(`display:grid; grid-template-columns:2fr repeat(4,1fr); background:var(--slate-50); border-bottom:1px solid var(--border-subtle);`)}>
          <div style={css(`padding:13px 18px; font:var(--fw-semibold) var(--text-2xs)/1.2 var(--font-body); color:var(--text-tertiary); text-transform:uppercase; letter-spacing:.05em;`)}>สิทธิ์การใช้งาน</div>
          {permRoles.map((r, rI) => (
            <div key={rI} style={css(`padding:10px 8px; text-align:center; border-left:1px solid var(--border-subtle); background:${r.headBg};`)}>
              <div style={css(`font:var(--fw-semibold) var(--text-2xs)/1.3 var(--font-body); color:${r.headFg};`)}>{r.th}</div>
              {r.current && <div style={css(`margin-top:4px; font:600 9px/1 var(--font-mono); color:${r.color}; letter-spacing:.04em;`)}>● บทบาทของคุณ</div>}
            </div>
          ))}
        </div>
        {permRows.map((p, pI) => (
          <div key={pI} style={css(`display:grid; grid-template-columns:2fr repeat(4,1fr); border-bottom:1px solid var(--border-subtle);`)}>
            <div style={css(`padding:13px 18px; font:var(--fw-medium) var(--text-sm)/1.4 var(--font-body); color:var(--text-primary);`)}>{p.label}</div>
            {p.cells.map((c, cI) => (
              <div key={cI} onClick={c.onToggle} style={css(`padding:13px 8px; display:grid; place-items:center; border-left:1px solid var(--border-subtle); background:${c.cellBg}; cursor:${c.cursor};`)}>{c.mark}</div>
            ))}
          </div>
        ))}
      </div>

      {/* User List Section */}
      <div style={css(`display:flex; align-items:center; justify-content:space-between; margin-top:14px;`)}>
        <div>
          <div style={css(`font:var(--fw-bold) var(--text-base)/1.2 var(--font-display); color:var(--text-primary);`)}>รายชื่อผู้ใช้งานในระบบคลังน้ำยา ({usersList.length} คน)</div>
          <div style={css(`font:var(--text-2xs)/1.2 var(--font-body); color:var(--text-tertiary); margin-top:2px;`)}>ผู้ใช้งานที่ลงทะเบียนและสิทธิ์ในการเข้าใช้เครื่องระบบปฏิบัติการ</div>
        </div>
        {canAddUser && (
          <button 
            onClick={openAddUser}
            style={css(`display:inline-flex; align-items:center; gap:8px; padding:9px 14px; border-radius:var(--radius-md); border:none; background:var(--brand-700); color:#fff; cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body); box-shadow:var(--glow-brand-soft); transition:background var(--dur-fast);`)}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--brand-800)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--brand-700)'}
          >
            + เพิ่มผู้ใช้งานใหม่
          </button>
        )}
      </div>

      <div style={css(`background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md); box-shadow:var(--shadow-sm); overflow:hidden;`)}>
        <div style={css(`display:grid; grid-template-columns:1.5fr 1fr 1.2fr 1fr 0.6fr; background:var(--slate-50); border-bottom:1px solid var(--border-subtle); padding:12px 18px; font:var(--fw-semibold) var(--text-2xs)/1.2 var(--font-body); color:var(--text-tertiary); text-transform:uppercase; letter-spacing:0.04em;`)}>
          <div>ชื่อ-นามสกุล</div>
          <div>ชื่อเข้าใช้งาน (Username)</div>
          <div>บทบาทหน้าที่</div>
          <div>สถานะระบบ</div>
          <div style={{ textAlign: 'center' }}>การจัดการ</div>
        </div>
        {usersList.map((u, idx) => {
          const rLabel = ({ admin: 'ผู้ดูแลระบบ', supervisor: 'หัวหน้าคลังน้ำยา', technician: 'นักเทคนิคการแพทย์', viewer: 'ผู้ดูข้อมูล' })[u.role] || u.role;
          return (
            <div key={idx} style={css(`display:grid; grid-template-columns:1.5fr 1fr 1.2fr 1fr 0.6fr; border-bottom:1px solid var(--border-subtle); padding:12px 18px; align-items:center; font:var(--text-sm)/1.4 var(--font-body); color:var(--text-primary);`)}>
              <div style={css(`display:flex; align-items:center; gap:10px;`)}>
                <span style={css(`width:28px; height:28px; border-radius:50%; background:${u.color || 'var(--brand-700)'}; color:#fff; display:grid; place-items:center; font:600 11px/1 var(--font-body);`)}>{u.initials}</span>
                <span style={css(`font-weight:600;`)}>{u.name}</span>
              </div>
              <div style={css(`font-family:var(--font-mono); color:var(--text-secondary);`)}>{u.username}</div>
              <div>
                <span style={css(`padding:2px 8px; border-radius:var(--radius-pill); background:var(--brand-50); color:var(--brand-700); font:var(--fw-semibold) var(--text-3xs)/1.2 var(--font-body);`)}>
                  {rLabel}
                </span>
              </div>
              <div>
                <span style={css(`color:var(--green-700); display:inline-flex; align-items:center; gap:4px; font-size:var(--text-2xs); font-weight:600;`)}>
                  🟢 พร้อมใช้งาน
                </span>
              </div>
              <div style={{ display: 'grid', placeItems: 'center' }}>
                {u.role === 'admin' ? (
                  <span style={css(`font:var(--fw-semibold) var(--text-3xs)/1 var(--font-body); color:var(--text-disabled);`)}>Admin (ลบไม่ได้)</span>
                ) : (
                  isAdmin ? (
                    <button
                      onClick={() => {
                        if (window.confirm(`คุณต้องการลบผู้ใช้งาน "${u.name}" ใช่หรือไม่?`)) {
                          deleteUser(u.username);
                        }
                      }}
                      style={css(`border:none; background:transparent; color:var(--red-600); cursor:pointer; font:var(--fw-semibold) var(--text-2xs)/1 var(--font-body); padding:4px 8px; border-radius:var(--radius-sm);`)}
                      onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
                    >
                      ลบผู้ใช้
                    </button>
                  ) : (
                    <span style={css(`color:var(--text-tertiary); font-size:var(--text-2xs);`)}>—</span>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
