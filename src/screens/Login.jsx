import React from 'react';
import { css } from '../css.js';
import { Input } from '../components/Input.jsx';

export function Login({ v }) {
  const {
    notAuthed, loginForm, lfUser, lfPass, loginError, hasLoginError,
    submitLogin, demoAccounts, ic,
  } = v;

  const [remember, setRemember] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  return notAuthed ? (
    <>
      <div className="ov-in login-container" style={css(`position:fixed; inset:0; z-index:80; display:flex; background:var(--surface-page); overflow:auto;`)}>
        {/* Left branding panel */}
        <div className="login-left-panel" style={css(`flex:0 0 38%; min-width:340px; background:linear-gradient(155deg,#08202A 0%,#06596F 50%,#1A93B3 124%); color:#fff; padding:48px 44px; display:flex; flex-direction:column; justify-content:space-between; position:relative; overflow:hidden;`)}>
          <div style={css(`position:absolute; top:-80px; right:-60px; width:260px; height:260px; border-radius:50%; background:radial-gradient(circle,rgba(0,104,132,.6),transparent 70%);`)}></div>
          <div style={css(`position:absolute; bottom:-90px; left:-50px; width:240px; height:240px; border-radius:50%; background:radial-gradient(circle,rgba(94,108,214,.4),transparent 72%);`)}></div>
          
          <div style={css(`display:flex; align-items:center; gap:14px; position:relative;`)}>
            <div style={css(`width:60px; height:60px; border-radius:50%; overflow:hidden; border:2px solid rgba(255,255,255,0.9); display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.15);`)}>
              <img src="/assets/tuh_lab_logo.jpg" alt="ตรา รพธ." style={css(`width:102%; height:102%; object-fit:cover; border-radius:50%;`)} />
            </div>
            <div>
              <div style={css(`font:600 12px/1.4 'IBM Plex Mono',monospace; letter-spacing:.16em; color:#C7CCF2;`)}>TUH · REAGENT INVENTORY</div>
              <div style={css(`font:700 20px/1.2 'Anuphan',sans-serif;`)}>ระบบจัดการ Stock น้ำยา</div>
            </div>
          </div>

          <div style={css(`position:relative;`)}>
            <div style={css(`font:700 26px/1.3 'Anuphan',sans-serif; letter-spacing:-.01em;`)}>
              ระบบบริหารคลังน้ำยา<br />และสารเคมีวิเคราะห์<br />ห้องปฏิบัติการเทคนิคการแพทย์
            </div>
            <div style={css(`margin-top:12px; font:400 15px/1.7 'Sarabun',sans-serif; color:#E7E9F8; max-width:34ch;`)}>
              โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ · คลังควบคุมและติดตามการใช้งานอย่างเป็นระบบตามเกณฑ์มาตรฐาน Quality Management System
            </div>
          </div>

          <div style={css(`position:relative; font:400 12px/1.5 'Sarabun',sans-serif; color:#C7CCF2;`)}>
            โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ · ห้องปฏิบัติการเทคนิคการแพทย์
          </div>
        </div>

        {/* Right login form panel */}
        <div className="login-right-panel" style={css(`flex:1; padding:40px 44px; overflow-y:auto; display:flex; align-items:center; justify-content:center;`)}>
          <div style={css(`width:100%; max-width:390px;`)}>
            {/* Mobile Brand Header */}
            <div className="login-mobile-brand" style={css(`display:flex; align-items:center; gap:12px; margin-bottom:28px;`)}>
              <div style={css(`width:48px; height:48px; border-radius:50%; overflow:hidden; border:2px solid var(--border-subtle); display:flex; align-items:center; justify-content:center; flex-shrink:0;`)}>
                <img src="/assets/tuh_lab_logo.jpg" alt="ตรา รพธ." style={css(`width:102%; height:102%; object-fit:cover; border-radius:50%;`)} />
              </div>
              <div style={css(`line-height:1.25;`)}>
                <div style={css(`font:600 11px/1.3 'IBM Plex Mono',monospace; letter-spacing:.08em; color:var(--brand-700);`)}>TUH · REAGENT INVENTORY</div>
                <div style={css(`font:700 15px/1.2 'Anuphan',sans-serif; color:var(--text-primary);`)}>ระบบจัดการ Stock น้ำยา</div>
              </div>
            </div>
            <div style={css(`font:600 26px/1.3 'Anuphan',sans-serif; color:var(--text-primary); margin-bottom:6px;`)}>
              เข้าสู่ระบบ
            </div>
            <div style={css(`font:400 15.5px/1.6 'Sarabun',sans-serif; color:var(--text-tertiary); margin-bottom:26px;`)}>
              กรอกชื่อผู้ใช้และรหัสผ่านเพื่อเข้าใช้งานระบบ
            </div>

            <div style={css(`display:flex; flex-direction:column; gap:16px;`)}>
              <Input label="ชื่อผู้ใช้ (Username)" placeholder="เช่น admin" value={loginForm.username} onChange={lfUser} autoComplete="username" name="username" />
              <Input 
                label="รหัสผ่าน (Password)" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                value={loginForm.password} 
                onChange={lfPass} 
                autoComplete="new-password" 
                name="password"
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={css(`background:none; border:none; padding:4px; cursor:pointer; display:grid; place-items:center;`)}
                    title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                  >
                    {showPassword ? ic.eyeOff : ic.eye}
                  </button>
                }
              />
              
              {/* Remember me & Forgot Password */}
              <div style={css(`display:flex; align-items:center; justify-content:space-between; font:400 13px/1 'Sarabun',sans-serif;`)}>
                <label style={css(`display:flex; align-items:center; gap:6px; cursor:pointer; color:var(--text-secondary);`)}>
                  <input 
                    type="checkbox" 
                    checked={remember} 
                    onChange={() => setRemember(!remember)}
                    style={css(`cursor:pointer; width:14px; height:14px;`)} 
                  />
                  จดจำรหัสผ่าน
                </label>
                <span 
                  style={css(`color:var(--text-tertiary); cursor:pointer; text-decoration:underline; font-size:12.5px;`)}
                  onClick={() => alert('หากลืมรหัสผ่าน กรุณาติดต่อหน่วยควบคุมคลังน้ำยา (ห้องปฏิบัติการเทคนิคการแพทย์ รพ.ธรรมศาสตร์ฯ โทรภายใน 1125)')}
                >
                  หากลืมรหัสติดต่อผู้ดูแล
                </span>
              </div>

              {hasLoginError && (
                <div style={css(`padding:10px 14px; border-radius:var(--radius-md); background:var(--red-100); color:var(--red-700); font:var(--fw-medium) var(--text-sm)/1.5 var(--font-body);`)}>
                  {loginError}
                </div>
              )}

              <button onClick={submitLogin} style={css(`margin-top:2px; padding:13px; border-radius:var(--radius-md); border:none; background:var(--brand-700); color:#fff; cursor:pointer; font:var(--fw-semibold) var(--text-md)/1 var(--font-body); box-shadow:var(--glow-brand-soft);`)}>
                เข้าสู่ระบบ
              </button>
            </div>


          </div>
        </div>
      </div>
    </>
  ) : null;
}
