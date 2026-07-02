import React from 'react';
// Trigger Cloudflare Pages rebuild
import { css } from './css.js';
import { Sidebar } from './layout/Sidebar.jsx';
import { Main } from './layout/Main.jsx';
import { DetailDrawer } from './screens/DetailDrawer.jsx';
import { ReceiveModal } from './screens/ReceiveModal.jsx';
import { IssueModal } from './screens/IssueModal.jsx';
import { Toast } from './components/Toast.jsx';
import { Login } from './screens/Login.jsx';
import { RegisterModal } from './screens/RegisterModal.jsx';
import { AddUserModal } from './screens/AddUserModal.jsx';
import { PrintStickerModal } from './screens/PrintStickerModal.jsx';
import { EditLotModal } from './screens/EditLotModal.jsx';
import { EditTransactionModal } from './screens/EditTransactionModal.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    const t = new Date(); t.setHours(0, 0, 0, 0);
    this.today = t;
    this.token = sessionStorage.getItem('authToken') || null;
    this.state = {
      view: 'dashboard', role: null, invTab: 'all', search: '', detailId: null, modal: null, toast: null, acked: {},
      reagents: [], lots: [], txns: [],
      perms: this.defaultPerms(), loginForm: { username: '', password: '', error: '' },
      rf: this.blankRf(), iform: this.blankIf(), mform: this.blankMf(),
      users: [], uform: { name: '', username: '', role: 'technician', password: '' },
      printLotData: null,
      sidebarOpen: false,
      editingLotId: null, elForm: this.blankElf(),
      editingTxnId: null, etForm: this.blankEtf(),
    };
    this.user = { name: 'ทนพ. สมชาย ใจดี', role: 'นักเทคนิคการแพทย์', initials: 'สช' };
  }
  blankRf() { return { rid: '', lot: '', expiry: '', qty: '', supplier: '', loc: 'ตู้เย็น A1' }; }
  blankIf() { return { rid: '', qty: '', scan: 'MANUAL', ref: '', lotId: '', qrInput: '', searchInput: '' }; }
  blankElf() { return { expiry: '', qty: '', loc: '' }; }
  blankEtf() { return { qty: '', ref: '' }; }
  blankMf() { return { code: '', th: '', en: '', cat: 'CHE', unit: 'vial', subUnit: '', subUnitQty: '', testsPerSubUnit: '', testsPerUnit: '', storage: 'REFRIGERATED_2_8', min: '', reorder: '', supplier: 'i-med', img: '/reagent_placeholder.png' }; }
  defaultPerms() { const o = {}; this.ROLES().forEach(r => { o[r.id] = { ...r.perms }; }); return o; }
  USERNAMES() { return { admin: 'admin', supervisor: 'supervisor', technician: 'technician', viewer: 'viewer' }; }
  bindLF(k) { return (e) => { const v = e && e.target ? e.target.value : e; this.setState(s => ({ loginForm: { ...s.loginForm, [k]: v, error: '' } })); }; }
  async submitLogin() {
    const f = this.state.loginForm;
    const username = (f.username || '').trim();
    if (!username) { this.setState(s => ({ loginForm: { ...s.loginForm, error: 'กรุณากรอกชื่อผู้ใช้' } })); return; }
    if (!f.password) { this.setState(s => ({ loginForm: { ...s.loginForm, error: 'กรุณากรอกรหัสผ่าน' } })); return; }
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: f.password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        this.setState(s => ({ loginForm: { ...s.loginForm, error: data.error || 'เข้าสู่ระบบล้มเหลว' } }));
        return;
      }
      // Persist session, set the authenticated user, then load data.
      this.token = data.token;
      sessionStorage.setItem('authToken', data.token);
      sessionStorage.setItem('authUser', JSON.stringify(data.user));
      this.login(data.user.role, data.user.name, data.user.initials);
      this.fetchData();
    } catch (err) {
      this.setState(s => ({ loginForm: { ...s.loginForm, error: 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้: ' + err.message } }));
    }
  }
  bindUf(k) { return (e) => { const v = e && e.target ? e.target.value : e; this.setState(s => ({ uform: { ...s.uform, [k]: v } })); }; }
  async submitAddUser() {
    const f = this.state.uform;
    const name = (f.name || '').trim();
    const u = (f.username || '').trim().toLowerCase();
    const r = f.role;
    const p = (f.password || '').trim();
    if (!name) { this.showToast('กรุณากรอกชื่อ-นามสกุล', 'warn'); return; }
    if (!u) { this.showToast('กรุณากรอกชื่อเข้าใช้งาน (Username)', 'warn'); return; }
    if (!p) { this.showToast('กรุณากรอกรหัสผ่าน (Password)', 'warn'); return; }
    if (this.state.users.some(x => x.username.toLowerCase() === u)) {
      this.showToast('ชื่อเข้าใช้งานนี้ถูกใช้งานแล้ว', 'warn');
      return;
    }
    const initials = name.split(' ').map(x => x[0]).filter(Boolean).slice(0, 2).join('') || name.slice(0, 2);
    const color = ({ admin: '#1387A6', supervisor: '#4E7CB0', technician: '#2E9E63', viewer: '#6E8694' })[r] || '#6E8694';
    const newUser = { username: u, name, role: r, initials, color, password: p };

    try {
      const res = await this.api('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (!res.ok) throw new Error('เพิ่มผู้ใช้งานล้มเหลว');

      this.setState(s => ({
        users: [...s.users, newUser],
        uform: { name: '', username: '', role: 'technician', password: '' },
        modal: null
      }));
      this.showToast('เพิ่มผู้ใช้งาน ' + name + ' สำเร็จ');
    } catch (err) {
      this.showToast(err.message, 'warn');
    }
  }
  async deleteUser(username) {
    if (this.state.role !== 'admin') {
      this.showToast('เฉพาะผู้ดูแลระบบเท่านั้นที่มีสิทธิ์ลบผู้ใช้งาน', 'warn');
      return;
    }
    const userObj = this.state.users.find(u => u.username === username);
    if (!userObj) return;
    if (userObj.role === 'admin') {
      const adminsCount = this.state.users.filter(u => u.role === 'admin').length;
      if (adminsCount <= 1) {
        this.showToast('ต้องมีผู้ดูแลระบบ (Admin) เหลืออยู่ในระบบอย่างน้อย 1 คน', 'warn');
        return;
      }
    }

    try {
      const res = await this.api(`/api/users?username=${encodeURIComponent(username)}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('ลบผู้ใช้งานล้มเหลว');

      this.setState(s => ({
        users: s.users.filter(u => u.username !== username)
      }));
      this.showToast('ลบผู้ใช้งาน ' + userObj.name + ' สำเร็จ');
    } catch (err) {
      this.showToast(err.message, 'warn');
    }
  }
  async deleteReagent(id) {
    if (this.state.role !== 'admin') {
      this.showToast('เฉพาะผู้ดูแลระบบเท่านั้นที่มีสิทธิ์ลบข้อมูลน้ำยา', 'warn');
      return;
    }
    const reagentObj = this.state.reagents.find(r => r.id === id);
    if (!reagentObj) return;

    try {
      const res = await this.api(`/api/reagents?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('ลบข้อมูลน้ำยาล้มเหลว');

      this.setState(s => ({
        reagents: s.reagents.filter(r => r.id !== id),
        lots: s.lots.filter(l => l.rid !== id),
        txns: s.txns.filter(t => t.rid !== id)
      }));
      this.showToast('ลบข้อมูลน้ำยา ' + reagentObj.th + ' และข้อมูลคลังสำเร็จ');
    } catch (err) {
      this.showToast(err.message, 'warn');
    }
  }
  async clearTxns() {
    if (this.state.role !== 'admin') {
      this.showToast('เฉพาะผู้ดูแลระบบเท่านั้นที่มีสิทธิ์ล้างประวัติการเคลื่อนไหว', 'warn');
      return;
    }
    if (window.confirm('คุณต้องการล้างประวัติการเคลื่อนไหวทั้งหมดในระบบใช่หรือไม่? (ประวัติการคุมคลังและ Audit Trail จะเป็นศูนย์และไม่สามารถเรียกคืนได้)')) {
      try {
        const res = await this.api('/api/transactions', { method: 'DELETE' });
        if (!res.ok) throw new Error('ล้างประวัติล้มเหลว');
        this.fetchData();
        this.showToast('ล้างประวัติการเคลื่อนไหวเรียบร้อยแล้ว');
      } catch (err) {
        this.showToast(err.message, 'warn');
      }
    }
  }
  openPrintSticker(lot, reagent) {
    this.setState({ printLotData: { lot, reagent }, modal: 'printSticker' });
  }
  closePrintSticker() {
    this.setState({ printLotData: null, modal: null });
  }
  async togglePerm(roleId, key) {
    if (this.state.role !== 'admin') { this.showToast('เฉพาะผู้ดูแลระบบเท่านั้นที่แก้ไขสิทธิ์ได้', 'warn'); return; }
    const cur = this.state.perms[roleId][key];
    const next = cur ? 0 : 1;
    const rname = (this.ROLES().find(r => r.id === roleId) || {}).th;
    // Optimistic update, then persist; revert on failure.
    this.setState(s => ({ perms: { ...s.perms, [roleId]: { ...s.perms[roleId], [key]: next } } }));
    try {
      const res = await this.api('/api/permissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: roleId, perm: key, allowed: next })
      });
      if (!res.ok) throw new Error('บันทึกสิทธิ์ล้มเหลว');
      this.showToast((cur ? 'ยกเลิก' : 'เพิ่ม') + 'สิทธิ์ของ' + rname + 'แล้ว');
    } catch (err) {
      this.setState(s => ({ perms: { ...s.perms, [roleId]: { ...s.perms[roleId], [key]: cur } } }));
      this.showToast(err.message, 'warn');
    }
  }
  ROLES() {
    return [
      { id: 'admin', th: 'ผู้ดูแลระบบ', en: 'Administrator', name: 'ทนพ. ธนวัฒน์ ผู้ดูแลระบบ', initials: 'ธว', color: '#1387A6', perms: { view: 1, receive: 1, issue: 1, manage: 1, ack: 1, users: 1, settings: 1 } },
      { id: 'supervisor', th: 'หัวหน้าคลังน้ำยา', en: 'Store Supervisor', name: 'ภญ. สมหญิง รักษ์ดี', initials: 'สญ', color: '#4E7CB0', perms: { view: 1, receive: 1, issue: 1, manage: 1, ack: 1, users: 0, settings: 0 } },
      { id: 'technician', th: 'นักเทคนิคการแพทย์', en: 'Medical Technologist', name: 'ทนพ. สมชาย ใจดี', initials: 'สช', color: '#2E9E63', perms: { view: 1, receive: 0, issue: 1, manage: 0, ack: 1, users: 0, settings: 0 } },
      { id: 'viewer', th: 'ผู้ดูข้อมูล', en: 'Viewer', name: 'คุณวิภา (ผู้สังเกตการณ์)', initials: 'วภ', color: '#6E8694', perms: { view: 1, receive: 0, issue: 0, manage: 0, ack: 0, users: 0, settings: 0 } },
    ];
  }
  PERM_LABELS() {
    return [
      { key: 'view', label: 'ดูคลังน้ำยาและประวัติการเคลื่อนไหว' },
      { key: 'receive', label: 'รับน้ำยาเข้าคลัง (Receive)' },
      { key: 'issue', label: 'เบิกจ่ายน้ำยาแบบ FEFO' },
      { key: 'manage', label: 'จัดการข้อมูลน้ำยา (Master)' },
      { key: 'ack', label: 'รับทราบ/จัดการการแจ้งเตือน' },
      { key: 'users', label: 'จัดการผู้ใช้และสิทธิ์' },
      { key: 'settings', label: 'ตั้งค่าเกณฑ์ของระบบ' },
    ];
  }
  login(id, name, initials) { const r = this.ROLES().find(x => x.id === id); if (!r) return; this.user = { name: name || r.name, role: r.th, initials: initials || r.initials, roleId: r.id }; this.setState({ role: id, view: 'dashboard', detailId: null, modal: null }); }
  async logout() {
    try { await this.api('/api/logout', { method: 'POST' }); } catch (e) { /* best effort */ }
    this.token = null;
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('authUser');
    this.user = { name: 'ทนพ. สมชาย ใจดี', role: 'นักเทคนิคการแพทย์', initials: 'สช' };
    this.setState({ role: null, detailId: null, modal: null, reagents: [], lots: [], txns: [], users: [], loginForm: { username: '', password: '', error: '' } });
  }
  can(p) { const m = this.state.perms[this.state.role]; return m ? !!m[p] : false; }

  // Authenticated fetch — attaches the session token and auto-signs-out on 401.
  async api(path, opts = {}) {
    const headers = { ...(opts.headers || {}) };
    if (this.token) headers['Authorization'] = 'Bearer ' + this.token;
    const res = await fetch(path, { ...opts, headers });
    if (res.status === 401) {
      this.handleAuthExpired();
      throw new Error('หมดเวลาการเข้าสู่ระบบ กรุณาเข้าสู่ระบบใหม่');
    }
    return res;
  }
  handleAuthExpired() {
    this.token = null;
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('authUser');
    this.user = { name: 'ทนพ. สมชาย ใจดี', role: 'นักเทคนิคการแพทย์', initials: 'สช' };
    this.setState({ role: null, detailId: null, modal: null, reagents: [], lots: [], txns: [], users: [], loginForm: { username: '', password: '', error: '' } });
  }

  async fetchData() {
    try {
      const [reagentsRes, lotsRes, txnsRes, usersRes, permsRes] = await Promise.all([
        this.api('/api/reagents'),
        this.api('/api/lots'),
        this.api('/api/transactions'),
        this.api('/api/users'),
        this.api('/api/permissions')
      ]);
      if (!reagentsRes.ok || !lotsRes.ok || !txnsRes.ok || !usersRes.ok || !permsRes.ok) {
        throw new Error('ดึงข้อมูลจากเซิร์ฟเวอร์ล้มเหลว');
      }
      const reagents = await reagentsRes.json();
      const lots = await lotsRes.json();
      const txns = await txnsRes.json();
      const users = await usersRes.json();
      const perms = await permsRes.json();
      this.setState(s => ({ reagents, lots, txns, users, perms: (perms && Object.keys(perms).length) ? perms : s.perms }));
    } catch (err) {
      this.showToast('ดึงข้อมูลล้มเหลว: ' + err.message, 'warn');
    }
  }

  componentDidMount() {
    // Restore a prior session (token + cached user) if present.
    if (this.token) {
      try {
        const cached = JSON.parse(sessionStorage.getItem('authUser') || 'null');
        if (cached) {
          const r = this.ROLES().find(x => x.id === cached.role);
          this.user = { name: cached.name, role: r ? r.th : cached.role, initials: cached.initials, roleId: cached.role };
          this.setState({ role: cached.role });
        }
      } catch (e) { /* ignore corrupt cache */ }
      this.fetchData();
    }
    if (!(window.lucide && window.lucide.icons)) {
      this._t = setInterval(() => { if (window.lucide && window.lucide.icons) { clearInterval(this._t); this.forceUpdate(); } }, 120);
    }
  }
  componentWillUnmount() { clearInterval(this._t); if (this._toastT) clearTimeout(this._toastT); }

  icon(name, size, color, sw) {
    const lib = (window.lucide && window.lucide.icons) || {};
    const node = lib[name];
    if (!node) return React.createElement('span', { style: { display: 'inline-block', width: size || 18, height: size || 18 } });
    const ch = Array.isArray(node) ? node : (node[2] || []);
    return React.createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', width: size || 18, height: size || 18, viewBox: '0 0 24 24', fill: 'none', stroke: color || 'currentColor', strokeWidth: sw || 2, strokeLinecap: 'round', strokeLinejoin: 'round', style: { display: 'block', flexShrink: 0 } }, ch.map((c, i) => React.createElement(c[0], { key: i, ...c[1] })));
  }

  bindMf(k) { return (e) => { const v = e && e.target ? e.target.value : e; this.setState(s => ({ mform: { ...s.mform, [k]: v } })); }; }
  openRegister() {
    if (!this.can('manage')) { this.showToast('บทบาทนี้ไม่มีสิทธิ์ลงทะเบียนน้ำยา', 'warn'); return; }
    this.setState({ modal: 'register', editReagentId: null, mform: this.blankMf() });
  }
  openEditReagent(reagentId) {
    if (this.state.role !== 'admin') { this.showToast('เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่มีสิทธิ์แก้ไขข้อมูลน้ำยา', 'warn'); return; }
    const r = this.state.reagents.find(x => x.id === reagentId);
    if (!r) return;

    let subUnitName = '';
    let subUnitQty = '';
    let testsPerSubUnit = '';
    if (r.subUnit) {
      const parts = r.subUnit.split(':');
      subUnitName = parts[0] || '';
      subUnitQty = parts[1] || '';
      testsPerSubUnit = parts[2] || '';
    }

    this.setState({
      modal: 'register', // Reuse Register modal UI
      editReagentId: reagentId,
      mform: {
        code: r.code,
        th: r.th,
        en: r.en,
        cat: r.cat,
        unit: r.unit,
        subUnit: subUnitName,
        subUnitQty: subUnitQty,
        testsPerSubUnit: testsPerSubUnit,
        testsPerUnit: r.testsPerUnit || '',
        storage: r.storage,
        min: r.min,
        reorder: r.reorder || r.min,
        supplier: r.supplier,
        img: r.img
      }
    });
  }
  async submitRegister() {
    if (!this.can('manage')) { this.showToast('บทบาทนี้ไม่มีสิทธิ์ลงทะเบียนน้ำยา', 'warn'); return; }
    const f = this.state.mform;
    const min = +f.min;
    const reorder = f.reorder ? +f.reorder : min; // Default reorder to min
    
    let subUnitValue = '';
    let calculatedTestsPerUnit = null;
    if (f.subUnit) {
      const subQty = parseInt(f.subUnitQty, 10);
      const subTests = parseInt(f.testsPerSubUnit, 10);
      if (!isNaN(subQty) && subQty > 0) {
        if (!isNaN(subTests) && subTests > 0) {
          calculatedTestsPerUnit = subQty * subTests;
          subUnitValue = `${f.subUnit}:${subQty}:${subTests}`;
        } else {
          calculatedTestsPerUnit = subQty;
          subUnitValue = `${f.subUnit}:${subQty}:`;
        }
      } else {
        subUnitValue = f.subUnit;
      }
    } else {
      calculatedTestsPerUnit = f.testsPerUnit ? parseInt(f.testsPerUnit, 10) : null;
    }

    if (!f.th || !f.cat || !f.unit || !f.storage || !(min >= 0)) {
      this.showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'warn'); return;
    }

    const generatedCode = `RGT-${f.cat.toUpperCase()}-${Date.now()}`;

    const payload = {
      code: generatedCode,
      th: f.th,
      en: f.en || f.th,
      cat: f.cat,
      unit: f.unit,
      subUnit: subUnitValue,
      testsPerUnit: calculatedTestsPerUnit,
      storage: f.storage,
      min,
      reorder,
      supplier: f.supplier || 'i-med',
      img: f.img || '/reagent_placeholder.png'
    };

    try {
      const res = await this.api('/api/reagents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'ลงทะเบียนน้ำยาล้มเหลว');
      }
      const newReagent = await res.json();
      this.setState(s => ({
        reagents: [...s.reagents, newReagent],
        modal: null
      }));
      this.showToast(`ลงทะเบียนน้ำยา "${f.th}" สำเร็จ (รหัส: ${newReagent.code})`);
    } catch (err) {
      this.showToast(err.message, 'warn');
    }
  }

  async submitEditReagent() {
    if (this.state.role !== 'admin') { this.showToast('เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่มีสิทธิ์แก้ไขข้อมูลน้ำยา', 'warn'); return; }
    const f = this.state.mform;
    const min = +f.min;
    const reorder = f.reorder ? +f.reorder : min;
    
    let subUnitValue = '';
    let calculatedTestsPerUnit = null;
    if (f.subUnit) {
      const subQty = parseInt(f.subUnitQty, 10);
      const subTests = parseInt(f.testsPerSubUnit, 10);
      if (!isNaN(subQty) && subQty > 0) {
        if (!isNaN(subTests) && subTests > 0) {
          calculatedTestsPerUnit = subQty * subTests;
          subUnitValue = `${f.subUnit}:${subQty}:${subTests}`;
        } else {
          calculatedTestsPerUnit = subQty;
          subUnitValue = `${f.subUnit}:${subQty}:`;
        }
      } else {
        subUnitValue = f.subUnit;
      }
    } else {
      calculatedTestsPerUnit = f.testsPerUnit ? parseInt(f.testsPerUnit, 10) : null;
    }

    if (!f.th || !f.cat || !f.unit || !f.storage || !(min >= 0)) {
      this.showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'warn'); return;
    }

    const payload = {
      id: this.state.editReagentId,
      th: f.th,
      en: f.en || f.th,
      cat: f.cat,
      unit: f.unit,
      subUnit: subUnitValue,
      testsPerUnit: calculatedTestsPerUnit,
      storage: f.storage,
      min,
      reorder,
      supplier: f.supplier,
      img: f.img || '/reagent_placeholder.png'
    };

    try {
      const res = await this.api('/api/reagents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'แก้ไขข้อมูลน้ำยาล้มเหลว');
      }
      
      this.setState(s => {
        const updatedReagents = s.reagents.map(r => r.id === s.editReagentId ? { ...r, ...payload } : r);
        return {
          reagents: updatedReagents,
          modal: null,
          editReagentId: null
        };
      });
      this.showToast(`แก้ไขข้อมูลน้ำยา "${f.th}" เรียบร้อยแล้ว`);
    } catch (err) {
      this.showToast(err.message, 'warn');
    }
  }

  async updateReagentCategory(id, newCat) {
    if (!this.can('manage')) { this.showToast('บทบาทนี้ไม่มีสิทธิ์แก้ไขหมวดน้ำยา', 'warn'); return; }
    const r = this.state.reagents.find(x => x.id === id);
    if (!r) return;
    const payload = {
      id, th: r.th, en: r.en, cat: newCat, unit: r.unit, subUnit: r.subUnit,
      testsPerUnit: r.testsPerUnit, storage: r.storage, min: r.min, reorder: r.reorder,
      supplier: r.supplier, img: r.img
    };
    try {
      const res = await this.api('/api/reagents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('เปลี่ยนหมวดน้ำยาล้มเหลว');
      this.setState(s => ({ reagents: s.reagents.map(x => x.id === id ? { ...x, cat: newCat } : x) }));
      this.showToast(`เปลี่ยนหมวดของ "${r.th}" เรียบร้อยแล้ว`);
    } catch (err) {
      this.showToast(err.message, 'warn');
    }
  }

  bindElf(k) { return (e) => { const v = e && e.target ? e.target.value : e; this.setState(s => ({ elForm: { ...s.elForm, [k]: v } })); }; }
  openEditLot(lotId) {
    if (!this.can('manage')) { this.showToast('บทบาทนี้ไม่มีสิทธิ์แก้ไขข้อมูล Lot', 'warn'); return; }
    const l = this.state.lots.find(x => x.id === lotId);
    if (!l) return;
    this.setState({ modal: 'editLot', editingLotId: lotId, elForm: { expiry: l.expiry, qty: l.qty, loc: l.loc } });
  }
  async submitEditLot() {
    if (!this.can('manage')) { this.showToast('บทบาทนี้ไม่มีสิทธิ์แก้ไขข้อมูล Lot', 'warn'); return; }
    const id = this.state.editingLotId;
    const f = this.state.elForm;
    const qty = +f.qty;
    if (!f.expiry || !f.loc || isNaN(qty) || qty < 0) { this.showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'warn'); return; }
    try {
      const res = await this.api('/api/lots', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, expiry: f.expiry, qty, loc: f.loc })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'แก้ไขข้อมูล Lot ล้มเหลว');
      this.setState(s => ({
        lots: s.lots.map(l => l.id === id ? { ...l, ...data.lot } : l),
        txns: data.txn ? [...s.txns, data.txn] : s.txns,
        modal: null, editingLotId: null
      }));
      this.showToast('แก้ไขข้อมูล Lot เรียบร้อยแล้ว');
    } catch (err) {
      this.showToast(err.message, 'warn');
    }
  }

  bindEtf(k) { return (e) => { const v = e && e.target ? e.target.value : e; this.setState(s => ({ etForm: { ...s.etForm, [k]: v } })); }; }
  openEditTxn(txnId) {
    if (!this.can('manage')) { this.showToast('บทบาทนี้ไม่มีสิทธิ์แก้ไขรายการนี้', 'warn'); return; }
    const t = this.state.txns.find(x => x.id === txnId);
    if (!t) return;
    this.setState({ modal: 'editTxn', editingTxnId: txnId, etForm: { qty: Math.abs(t.qty), ref: t.ref || '' } });
  }
  async submitEditTxn() {
    if (!this.can('manage')) { this.showToast('บทบาทนี้ไม่มีสิทธิ์แก้ไขรายการนี้', 'warn'); return; }
    const id = this.state.editingTxnId;
    const t = this.state.txns.find(x => x.id === id);
    if (!t) return;
    const f = this.state.etForm;
    const magnitude = +f.qty;
    if (isNaN(magnitude) || magnitude <= 0) { this.showToast('กรุณากรอกจำนวนให้ถูกต้อง', 'warn'); return; }
    const signedQty = t.type === 'ISSUE' ? -magnitude : magnitude;
    try {
      const res = await this.api('/api/transactions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, qty: signedQty, ref: f.ref })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'แก้ไขรายการล้มเหลว');
      this.setState(s => ({
        txns: s.txns.map(x => x.id === id ? { ...x, ...data.txn } : x),
        lots: s.lots.map(l => l.id === data.lot.id ? { ...l, ...data.lot } : l),
        modal: null, editingTxnId: null
      }));
      this.showToast('แก้ไขรายการเรียบร้อยแล้ว');
    } catch (err) {
      this.showToast(err.message, 'warn');
    }
  }

  async deleteTxn(txnId) {
    if (!this.can('manage')) { this.showToast('บทบาทนี้ไม่มีสิทธิ์ลบรายการนี้', 'warn'); return; }
    const t = this.state.txns.find(x => x.id === txnId);
    if (!t) return;
    const kindLabel = t.type === 'RECEIVE' ? 'รายการรับเข้า (และ Lot ที่สร้างขึ้น)' : t.type === 'ISSUE' ? 'รายการเบิกจ่าย' : 'รายการปรับปรุง';
    if (!window.confirm(`ยืนยันลบ${kindLabel}นี้ใช่หรือไม่? การลบนี้ไม่สามารถเรียกคืนได้`)) return;
    try {
      const res = await this.api(`/api/transactions?id=${txnId}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'ลบรายการล้มเหลว');
      this.setState(s => ({
        txns: s.txns.filter(x => x.id !== txnId),
        lots: data.deletedLotId
          ? s.lots.filter(l => l.id !== data.deletedLotId)
          : s.lots.map(l => (data.lot && l.id === data.lot.id) ? { ...l, ...data.lot } : l)
      }));
      this.showToast(`ลบ${kindLabel}เรียบร้อยแล้ว`);
    } catch (err) {
      this.showToast(err.message, 'warn');
    }
  }
  deleteLotReceive(lotId) {
    const receiveTxn = this.state.txns.find(t => t.lotId === lotId && t.type === 'RECEIVE');
    if (!receiveTxn) { this.showToast('ไม่พบรายการรับเข้าต้นทางของ Lot นี้ (อาจถูกลบไปแล้วหรือข้อมูลเก่า)', 'warn'); return; }
    this.deleteTxn(receiveTxn.id);
  }

  // ── derivations ──
  STORAGE_LABEL(s) { return ({ REFRIGERATED_2_8: '2–8°C', FROZEN_40: '−40°C', ROOM_TEMP: 'อุณหภูมิห้อง' })[s] || s; }
  CAT_LABEL(c) { return ({ CHE: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์', HEM: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์', IMM: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์', MIP: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์', MDC: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์', HMS: 'บริการศูนย์การแพทย์', ADV: 'ตรวจวินิจฉัยขั้นสูง' })[c] || c; }
  days(d) { return Math.round((new Date(d + 'T00:00:00') - this.today) / 86400000); }
  activeLots(rid) { return this.state.lots.filter(l => l.rid === rid && l.qty > 0 && l.status === 'ACTIVE'); }
  onHand(rid) { return this.activeLots(rid).reduce((s, l) => s + l.qty, 0); }
  earliest(rid) { const a = this.activeLots(rid).map(l => l.expiry).sort(); return a[0] || null; }
  sev(days, crit) { const c = crit || 30; if (days <= c) return 'critical'; if (days <= c * 2) return 'warning'; if (days <= c * 3) return 'watch'; return 'ok'; }
  sevCol(s) { return ({
    critical: { fg: 'var(--red-700)', bg: 'var(--red-100)', dot: 'var(--red-600)', th: 'วิกฤต' },
    warning: { fg: 'var(--amber-700)', bg: 'var(--amber-100)', dot: 'var(--amber-600)', th: 'เฝ้าระวัง' },
    watch: { fg: 'var(--blue-700)', bg: 'var(--blue-100)', dot: 'var(--blue-600)', th: 'ติดตาม' },
    ok: { fg: 'var(--green-700)', bg: 'var(--green-100)', dot: 'var(--green-600)', th: 'ปกติ' },
  })[s]; }
  dayLabel(d) { return d < 0 ? 'หมดอายุแล้ว' : (d === 0 ? 'หมดอายุวันนี้' : 'เหลือ ' + d + ' วัน'); }
  txnMeta(type) { return ({
    RECEIVE: { label: 'รับเข้า', fg: 'var(--green-700)', bg: 'var(--green-100)' },
    ISSUE: { label: 'เบิกจ่าย', fg: 'var(--accent-700)', bg: 'var(--accent-50)' },
    ADJUST: { label: 'ปรับปรุง', fg: 'var(--blue-700)', bg: 'var(--blue-100)' },
    DISPOSE: { label: 'ทำลาย', fg: 'var(--red-700)', bg: 'var(--red-100)' },
  })[type] || { label: type, fg: 'var(--slate-700)', bg: 'var(--slate-100)' }; }

  buildAlerts(crit) {
    const out = [];
    this.state.reagents.forEach(r => {
      this.activeLots(r.id).forEach(l => {
        const d = this.days(l.expiry);
        if (d <= crit * 3) {
          const s = this.sev(d, crit); const c = this.sevCol(s);
          const key = 'E' + l.id;
          out.push({ key, kind: 'EXPIRY', rid: r.id, sev: s, order: s === 'critical' ? 0 : s === 'warning' ? 1 : 2,
            title: r.th + ' · Lot ' + l.lot, sub: 'หมดอายุ ' + l.expiry + ' (' + this.dayLabel(d) + ') · คงเหลือ ' + l.qty + ' ' + r.unit,
            tag: this.dayLabel(d), fg: c.fg, bg: c.bg });
        }
      });
      const oh = this.onHand(r.id);
      if (oh <= r.min) {
        const key = 'R' + r.id; const c = oh === 0 ? this.sevCol('critical') : this.sevCol('warning');
        out.push({ key, kind: 'REORDER', rid: r.id, sev: oh === 0 ? 'critical' : 'warning', order: oh === 0 ? 0 : 1,
          title: r.th + ' · ต่ำกว่าจุดสั่งซื้อ', sub: 'คงเหลือ ' + oh + ' / จุดสั่งซื้อ ' + r.min + ' ' + r.unit + ' · แนะนำสั่ง ' + r.reorder + ' ' + r.unit,
          tag: 'สั่งซื้อซ้ำ', fg: c.fg, bg: c.bg });
      }
    });
    return out.filter(a => !this.state.acked[a.key]).sort((a, b) => a.order - b.order);
  }

  // ── handlers ──
  nav(v) { this.setState({ view: v, detailId: null, sidebarOpen: false }); }
  showToast(msg, kind) { if (this._toastT) clearTimeout(this._toastT); this.setState({ toast: { msg, kind: kind || 'ok' } }); this._toastT = setTimeout(() => this.setState({ toast: null }), 2800); }
  openDetail(id) { this.setState({ detailId: id }); }
  closeDetail() { this.setState({ detailId: null }); }
  openReceive(rid) { if (!this.can('receive')) { this.showToast('บทบาทนี้ไม่มีสิทธิ์รับเข้า', 'warn'); return; } this.setState({ modal: 'receive', rf: { ...this.blankRf(), rid: rid ? String(rid) : '' } }); }
  openIssue(rid) {
    if (!this.can('issue')) { this.showToast('บทบาทนี้ไม่มีสิทธิ์เบิกจ่าย', 'warn'); return; }
    const r = this.state.reagents.find(x => x.id === rid);
    this.setState({
      modal: 'issue',
      iform: {
        ...this.blankIf(),
        rid: rid ? String(rid) : '',
        searchInput: r ? r.th : ''
      }
    });
  }
  openIssueWithLot(rid, lotId) {
    if (!this.can('issue')) { this.showToast('บทบาทนี้ไม่มีสิทธิ์เบิกจ่าย', 'warn'); return; }
    const r = this.state.reagents.find(x => x.id === rid);
    const l = this.state.lots.find(x => x.id === lotId);
    this.setState({
      modal: 'issue',
      iform: {
        ...this.blankIf(),
        rid: String(rid),
        lotId: String(lotId),
        scan: 'QR',
        searchInput: r ? r.th : '',
        qrInput: l ? l.qr : ''
      }
    });
  }
  scanQRCode(code) {
    const cleanCode = (code || '').trim().toLowerCase();
    if (!cleanCode) return;
    const foundLot = this.state.lots.find(l => (l.qr || '').toLowerCase() === cleanCode && l.qty > 0 && l.status === 'ACTIVE');
    if (foundLot) {
      const r = this.state.reagents.find(x => x.id === foundLot.rid);
      this.setState(s => ({
        iform: {
          ...s.iform,
          rid: String(foundLot.rid),
          lotId: String(foundLot.id),
          scan: 'QR',
          searchInput: r ? r.th : '',
          qrInput: foundLot.qr
        }
      }));
      this.showToast(`สแกนพบ Lot ${foundLot.lot} ของ ${r ? r.th : ''} และทำการเชื่อมโยงข้อมูลแล้ว`, 'success');
      return;
    }
    const foundReagent = this.state.reagents.find(r => r.code.toLowerCase() === cleanCode);
    if (foundReagent) {
      this.setState(s => ({
        iform: {
          ...s.iform,
          rid: String(foundReagent.id),
          lotId: '',
          scan: 'QR',
          searchInput: foundReagent.th,
          qrInput: cleanCode
        }
      }));
      this.showToast(`สแกนพบน้ำยา ${foundReagent.th} แล้ว (จะจ่ายโดยใช้ระบบ FEFO)`, 'success');
      return;
    }
    this.showToast(`ไม่พบข้อมูล QR Code "${cleanCode}" หรือน้ำยาใน Lot นี้หมดคลังแล้ว`, 'warn');
  }
  unlinkLot() {
    this.setState(s => ({ iform: { ...s.iform, lotId: '' } }));
    this.showToast('ยกเลิกการเชื่อมโยงล็อตนี้แล้ว ระบบจะใช้ระบบ FEFO ตามปกติ');
  }
  selectReagentForIssue(rid) {
    const r = this.state.reagents.find(x => x.id === +rid);
    this.setState(s => ({
      iform: {
        ...s.iform,
        rid: rid ? String(rid) : '',
        lotId: '',
        searchInput: r ? r.th : ''
      }
    }));
  }
  closeModal() { this.setState({ modal: null }); }
  ack(key) { if (!this.can('ack')) { this.showToast('บทบาทนี้ไม่มีสิทธิ์จัดการการแจ้งเตือน', 'warn'); return; } this.setState(s => ({ acked: { ...s.acked, [key]: true } })); this.showToast('รับทราบการแจ้งเตือนแล้ว'); }
  bindRf(k) { return (e) => { const v = e && e.target ? e.target.value : e; this.setState(s => ({ rf: { ...s.rf, [k]: v } })); }; }
  bindIf(k) { return (e) => { const v = e && e.target ? e.target.value : e; this.setState(s => ({ iform: { ...s.iform, [k]: v } })); }; }

  issuePlan(crit) {
    const f = this.state.iform; const rid = +f.rid; let need = +f.qty || 0;
    const rows = []; let short = need;
    if (!rid) return { rows: [], short: 0, need };
    if (f.lotId) {
      const l = this.state.lots.find(x => x.id === +f.lotId);
      if (l) {
        const take = Math.min(short, l.qty); const d = this.days(l.expiry);
        rows.push({ lotId: l.id, lot: l.lot, expiry: l.expiry, take, dayLabel: this.dayLabel(d), col: this.sevCol(this.sev(d, crit)).fg, after: l.qty - take });
        short -= take;
      }
    } else {
      const lots = this.activeLots(rid).slice().sort((a, b) => a.expiry.localeCompare(b.expiry));
      for (const l of lots) { if (short <= 0) break; const take = Math.min(short, l.qty); const d = this.days(l.expiry);
        rows.push({ lotId: l.id, lot: l.lot, expiry: l.expiry, take, dayLabel: this.dayLabel(d), col: this.sevCol(this.sev(d, crit)).fg, after: l.qty - take }); short -= take; }
    }
    return { rows, short: short > 0 ? short : 0, need };
  }

  async submitReceive() {
    const f = this.state.rf; const rid = +f.rid; const qty = +f.qty;
    if (!rid || !f.lot || !f.expiry || !(qty > 0)) { this.showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'warn'); return; }
    
    const payload = {
      rid,
      lot: f.lot,
      expiry: f.expiry,
      qty,
      loc: f.loc,
      by: this.user.name
    };

    try {
      const res = await this.api('/api/lots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('รับเข้าน้ำยาเข้าคลังล้มเหลว');
      
      this.setState({ modal: null });
      this.fetchData();
      const r = this.state.reagents.find(x => x.id === rid);
      this.showToast('รับเข้า ' + qty + ' ' + (r ? r.unit : '') + ' · Lot ' + f.lot + ' สำเร็จ');
    } catch (err) {
      this.showToast(err.message, 'warn');
    }
  }

  async submitIssue() {
    const crit = this.props.criticalDays ?? 30;
    const f = this.state.iform; const rid = +f.rid; const qty = +f.qty;
    const plan = this.issuePlan(crit);
    if (!rid || !(qty > 0)) { this.showToast('กรุณาเลือกน้ำยาและจำนวน', 'warn'); return; }
    if (plan.short > 0) { this.showToast('คงเหลือไม่พอเบิก (ขาด ' + plan.short + ')', 'warn'); return; }

    const payload = {
      rid,
      qty,
      scan: f.scan || 'MANUAL',
      ref: f.ref || '',
      lotId: f.lotId || null,
      by: this.user.name
    };

    try {
      const res = await this.api('/api/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'เบิกจ่ายล้มเหลว');
      }
      
      this.setState({ modal: null });
      this.fetchData();
      const r = this.state.reagents.find(x => x.id === rid);
      this.showToast('เบิกจ่าย ' + qty + ' ' + (r ? r.unit : '') + ' สำเร็จ');
    } catch (err) {
      this.showToast(err.message, 'warn');
    }
  }
  nowStr() { const d = new Date(); const p = (n) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`; }

  navStyle(v) {
    const a = this.state.view === v;
    return { bg: a ? 'var(--brand-50)' : 'transparent', fg: a ? 'var(--brand-800)' : 'var(--text-secondary)', ic: a ? 'var(--brand-700)' : 'var(--text-tertiary)' };
  }

  renderVals() {
    const crit = this.props.criticalDays ?? 30;
    const showEn = this.props.showEnglishNames ?? true;
    const S = this.state;
    const I = (n, c, sz) => this.icon(n, sz || 17, c || 'currentColor');
    const ic = {
      dashboard: I('LayoutDashboard'), boxes: I('Boxes'), list: I('List'), bell: I('Bell'), history: I('History'),
      receive: I('ArrowDownToLine', 'currentColor', 16), issue: I('ArrowUpFromLine', 'currentColor', 16),
      logout: I('LogOut', 'currentColor', 16), search: I('Search', 'var(--text-tertiary)', 16),
      qr: I('QrCode', 'currentColor', 16), close: I('X', 'currentColor', 18),
      thermo: I('Thermometer', 'var(--text-tertiary)', 15), pkg: I('Package', 'var(--text-tertiary)', 15),
      cal: I('CalendarClock', 'var(--text-tertiary)', 15), check: I('Check', '#fff', 16), shield: I('ShieldCheck'),
      help: I('BookOpen'), menu: I('Menu', 'currentColor', 20),
    };
    const dn = this.state.view;
    const titles = {
      dashboard: ['Dashboard', 'ภาพรวมคลังน้ำยาและการแจ้งเตือน'],
      inventory: ['คลังน้ำยา', 'รายการน้ำยาทั้งหมดและสถานะคงคลัง'],
      reagent_lists: ['Reagent Lists', 'ทะเบียนรายชื่อน้ำยาทั้งหมดในระบบห้องปฏิบัติการ'],
      alerts: ['การแจ้งเตือน', 'น้ำยาใกล้หมดอายุและจุดสั่งซื้อซ้ำ'],
      audit: ['ประวัติการเคลื่อนไหว', 'บันทึกการรับเข้า–เบิกจ่ายทั้งหมด (Audit Trail)'],
      perms: ['สิทธิ์การใช้งาน', 'สิทธิ์การเข้าถึงระบบตามบทบาทผู้ใช้งาน'],
      help: ['คู่มือการใช้งาน', 'วิธีการใช้งานระบบจัดเก็บคลังน้ำยาและบริหารคลังอย่างเป็นขั้นตอน'],
    };
    const ns = { dash: this.navStyle('dashboard'), inv: this.navStyle('inventory'), rlist: this.navStyle('reagent_lists'), al: this.navStyle('alerts'), au: this.navStyle('audit'), pm: this.navStyle('perms'), help: this.navStyle('help') };
    const alerts = this.buildAlerts(crit);

    // reagent view-models
    const rvm = (r) => {
      const oh = this.onHand(r.id); const earl = this.earliest(r.id);
      const d = earl != null ? this.days(earl) : null;
      const s = d != null ? this.sev(d, crit) : 'ok'; const sc = this.sevCol(s);
      const low = oh <= r.min;
      const lotCount = this.activeLots(r.id).length;
      
      let subUnitName = r.subUnit || '';
      if (subUnitName.includes(':')) {
        subUnitName = subUnitName.split(':')[0];
      }

      return { id: r.id, code: r.code, th: r.th, en: showEn ? r.en : '', cat: r.cat, catLabel: this.CAT_LABEL(r.cat),
        unit: r.unit, subUnit: subUnitName, onHand: oh, min: r.min, low, lotCount, storageLabel: this.STORAGE_LABEL(r.storage), onHandColor: low ? 'var(--red-700)' : 'var(--text-primary)',
        expDays: d, expLabel: d != null ? this.dayLabel(d) : '—', expColor: d != null ? sc.fg : 'var(--text-tertiary)',
        expiring: d != null && d <= crit * 3, sev: s, img: r.img || '/reagent_placeholder.png', onOpen: () => this.openDetail(r.id),
        testsPerUnit: r.testsPerUnit, testsTotal: r.testsPerUnit ? oh * r.testsPerUnit : null };
    };

    // KPIs
    const lotsActive = S.lots.filter(l => l.qty > 0 && l.status === 'ACTIVE').length;
    const expiringSoon = S.lots.filter(l => l.qty > 0 && l.status === 'ACTIVE' && this.days(l.expiry) <= crit * 3).length;
    const lowCount = S.reagents.filter(r => this.onHand(r.id) <= r.min).length;
    const kpis = [
      { value: S.reagents.length, label: 'ชนิดน้ำยาทั้งหมด', color: 'var(--brand-700)', bg: 'var(--brand-50)', icon: I('Boxes', 'var(--brand-700)', 21) },
      { value: expiringSoon, label: 'Lot ใกล้หมดอายุ', color: 'var(--amber-700)', bg: 'var(--amber-100)', icon: I('CalendarClock', 'var(--amber-700)', 21) },
      { value: lowCount, label: 'ต่ำกว่าจุดสั่งซื้อ', color: 'var(--red-700)', bg: 'var(--red-100)', icon: I('TriangleAlert', 'var(--red-700)', 21) },
      { value: lotsActive, label: 'Lot คงคลัง', color: 'var(--green-700)', bg: 'var(--green-100)', icon: I('FlaskConical', 'var(--green-700)', 21) },
    ];
    const dashAlerts = alerts.slice(0, 5).map(a => ({ ...a, icon: I(a.kind === 'EXPIRY' ? 'CalendarClock' : 'TriangleAlert', a.fg, 17), onOpen: () => this.openDetail(a.rid) }));
    const dashLow = S.reagents.filter(r => this.onHand(r.id) <= r.min).map(rvm);
    const recent = S.txns.slice().sort((a, b) => b.at.localeCompare(a.at)).slice(0, 6).map(t => {
      const r = S.reagents.find(x => x.id === t.rid); const l = S.lots.find(x => x.id === t.lotId); const m = this.txnMeta(t.type);
      return { name: r ? r.th : '—', lot: l ? l.lot : '—', by: t.by, typeLabel: m.label, fg: m.fg, bg: m.bg,
        qtyLabel: (t.qty > 0 ? '+' : '') + t.qty, qtyColor: t.qty > 0 ? 'var(--green-700)' : 'var(--accent-700)', at: t.at.slice(5) };
    });

    // inventory rows
    const q = S.search.trim().toLowerCase();
    let invRows = S.reagents.map(rvm).filter(r => {
      if (S.invTab === 'low' && !r.low) return false;
      if (S.invTab === 'expiring' && !r.expiring) return false;
      if (q && !(r.code.toLowerCase().includes(q) || r.th.toLowerCase().includes(q) || (r.en || '').toLowerCase().includes(q))) return false;
      return true;
    });
    const invTabs = [
      { value: 'all', label: 'ทั้งหมด', count: S.reagents.length },
      { value: 'low', label: 'ต่ำกว่าจุดสั่งซื้อ', count: lowCount },
      { value: 'expiring', label: 'ใกล้หมดอายุ', count: S.reagents.filter(r => { const e = this.earliest(r.id); return e != null && this.days(e) <= crit * 3; }).length },
    ];

    // detail
    let detail = null;
    if (S.detailId != null) {
      const r = S.reagents.find(x => x.id === S.detailId);
      if (r) {
        const vm = rvm(r);
        const lots = S.lots.filter(l => l.rid === r.id).slice().sort((a, b) => a.expiry.localeCompare(b.expiry)).map((l, i) => {
          const d = this.days(l.expiry); const sc = this.sevCol(this.sev(d, crit)); const dep = l.qty === 0 || l.status === 'DEPLETED';
          return { id: l.id, lot: l.lot, expiry: l.expiry, qty: l.qty, recv: l.recv, loc: l.loc, qr: l.qr,
            dayLabel: dep ? 'หมดแล้ว' : this.dayLabel(d), dayColor: dep ? 'var(--text-tertiary)' : sc.fg,
            fefoBadge: (i === 0 && !dep) ? 'FEFO ถัดไป' : '', statusLabel: dep ? 'หมด' : 'พร้อมใช้',
            statusFg: dep ? 'var(--slate-600)' : 'var(--green-700)', statusBg: dep ? 'var(--slate-100)' : 'var(--green-100)',
            onEdit: () => this.openEditLot(l.id), onDelete: () => this.deleteLotReceive(l.id) };
        });
        detail = { ...vm, supplier: r.supplier, reorder: r.reorder, lots, img: r.img || '/reagent_placeholder.png',
          onReceive: () => this.openReceive(r.id), onIssue: () => this.openIssue(r.id) };
      }
    }

    // alerts screen rows
    const alertRows = alerts.map(a => ({ ...a, icon: I(a.kind === 'EXPIRY' ? 'CalendarClock' : 'TriangleAlert', a.fg, 18),
      kindLabel: a.kind === 'EXPIRY' ? 'ใกล้หมดอายุ' : 'จุดสั่งซื้อซ้ำ', sevLabel: this.sevCol(a.sev).th,
      onAck: () => this.ack(a.key), onOpen: () => this.openDetail(a.rid) }));

    // audit rows
    const txnRows = S.txns.slice().sort((a, b) => b.at.localeCompare(a.at)).map(t => {
      const r = S.reagents.find(x => x.id === t.rid); const l = S.lots.find(x => x.id === t.lotId); const m = this.txnMeta(t.type);
      const scanLabel = ({ MANUAL: 'พิมพ์ชื่อ', QR: 'QR code', BARCODE: 'บาร์โค้ด' })[t.scan] || t.scan;
      return { id: t.id, rid: t.rid, name: r ? r.th : '—', code: r ? r.code : '', lot: l ? l.lot : '—', typeLabel: m.label, fg: m.fg, bg: m.bg,
        qtyLabel: (t.qty > 0 ? '+' : '') + t.qty + ' ' + (r ? r.unit : ''), qtyColor: t.qty > 0 ? 'var(--green-700)' : 'var(--accent-700)',
        scanLabel, ref: t.ref, by: t.by, at: t.at, qty: t.qty, type: t.type, unit: r ? r.unit : '',
        onEdit: () => this.openEditTxn(t.id), onDelete: () => this.deleteTxn(t.id) };
    });

    // usage stats list
    const maxUsed = Math.max(...S.reagents.map(r => S.txns.filter(t => t.rid === r.id && t.type === 'ISSUE').reduce((sum, t) => sum + Math.abs(t.qty), 0)), 1);
    const usageList = S.reagents.map(r => {
      const totalIssued = S.txns.filter(t => t.rid === r.id && t.type === 'ISSUE').reduce((sum, t) => sum + Math.abs(t.qty), 0);
      return {
        id: r.id, code: r.code, th: r.th, en: r.en, cat: r.cat, unit: r.unit,
        used: totalIssued, onHand: this.onHand(r.id),
        percent: (totalIssued / maxUsed) * 100
      };
    }).sort((a, b) => b.used - a.used);

    // dashboard kpi calculations
    const cats = ['CHE', 'HEM', 'IMM', 'MIP', 'MDC', 'HMS', 'ADV'];
    const catStats = cats.map(c => {
      const cReagents = S.reagents.filter(r => r.cat === c);
      const rIds = cReagents.map(r => r.id);
      const types = cReagents.length;
      const stock = S.lots.filter(l => rIds.includes(l.rid) && l.qty > 0 && l.status === 'ACTIVE').reduce((sum, l) => sum + l.qty, 0);
      const issue = Math.abs(S.txns.filter(t => rIds.includes(t.rid) && t.type === 'ISSUE').reduce((sum, t) => sum + t.qty, 0));
      const total = stock + issue;
      const turnover = total > 0 ? Math.round((issue / total) * 100) : 0;
      return { cat: c, types, stock, issue, turnover };
    });

    const monthsHistory = [
      { label: 'ม.ค. 26', issue: 220, rec: 240, change: 5.2 },
      { label: 'ก.พ. 26', issue: 180, rec: 200, change: -18.1 },
      { label: 'มี.ค. 26', issue: 290, rec: 320, change: 61.1 },
      { label: 'เม.ย. 26', issue: 210, rec: 220, change: -27.5 },
      { label: 'พ.ค. 26', issue: 280, rec: 300, change: 33.3 }
    ];
    const juneIssue = Math.abs(S.txns.filter(t => t.type === 'ISSUE' && t.at.startsWith('2026-06')).reduce((sum, t) => sum + t.qty, 0));
    const juneRec = S.txns.filter(t => t.type === 'RECEIVE' && t.at.startsWith('2026-06')).reduce((sum, t) => sum + t.qty, 0);
    const prevMonthIssue = monthsHistory[monthsHistory.length - 1].issue;
    const juneChange = Math.round(((juneIssue - prevMonthIssue) / prevMonthIssue) * 1000) / 10;
    const monthlyData = [
      ...monthsHistory,
      { label: 'มิ.ย. 26', issue: juneIssue || 142, rec: juneRec || 240, change: juneIssue ? juneChange : -49.2 }
    ];

    const weeklyPattern = [
      { day: 'อา.', val: 12 },
      { day: 'จ.', val: 45 },
      { day: 'อ.', val: 68 },
      { day: 'พ.', val: 55 },
      { day: 'พฤ.', val: 62 },
      { day: 'ศ.', val: 74 },
      { day: 'ส.', val: 18 }
    ];

    const topCatObj = [...catStats].sort((a,b) => b.issue - a.issue)[0];
    const topCatLabel = ({ CHE: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์', HEM: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์', IMM: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์', MIP: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์', MDC: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์', HMS: 'บริการศูนย์การแพทย์', ADV: 'ตรวจวินิจฉัยขั้นสูง' })[topCatObj.cat] || topCatObj.cat;
    const lowStockCount = S.reagents.filter(r => this.onHand(r.id) <= r.min).length;
    const insights = {
      topCatLabel,
      totalStock: S.lots.filter(l => l.qty > 0 && l.status === 'ACTIVE').reduce((sum, l) => sum + l.qty, 0),
      lowStockCount,
      totalReagents: S.reagents.length,
      juneIssue: juneIssue || 142,
      juneRec: juneRec || 240
    };

    // modal forms
    const reagentOpts = S.reagents.map(r => ({ value: String(r.id), label: r.th }));
    const locOpts = ['ตู้เย็น A1', 'ตู้เย็น A2', 'ตู้แช่แข็ง F1', 'ชั้นวาง B2', 'ชั้นวาง C1'].map(x => ({ value: x, label: x }));
    const supplierOpts = ['i-med', 'Firmer', 'Med-one'].map(x => ({ value: x, label: x }));
    const scanOpts = [{ value: 'MANUAL', label: 'พิมพ์ชื่อ / เลือกเอง' }, { value: 'QR', label: 'สแกน QR code' }, { value: 'BARCODE', label: 'สแกนบาร์โค้ด' }];
    const plan = this.issuePlan(crit);
    const issueReagent = S.reagents.find(r => r.id === +S.iform.rid);
    const issueOnHand = issueReagent ? this.onHand(issueReagent.id) : 0;

    return {
      setRoot: (el) => { this.rootRef = el; }, stop: (e) => e.stopPropagation(), ic, user: this.user,
      notAuthed: !S.role, onLogout: () => this.logout(), currentRoleLabel: this.user.role, canEditPerms: S.role === 'admin',
      loginForm: S.loginForm, lfUser: this.bindLF('username'), lfPass: this.bindLF('password'), loginError: S.loginForm.error, hasLoginError: !!S.loginForm.error, submitLogin: () => this.submitLogin(),
      // No demo/quick-login on a real system — credentials must be entered.
      demoAccounts: [],
      canAddUser: S.role === 'admin',
      usersList: S.users,
      openAddUser: () => this.setState({ modal: 'addUser' }),
      modalAddUser: S.modal === 'addUser',
      uform: S.uform,
      ufName: this.bindUf('name'),
      ufUsername: this.bindUf('username'),
      ufRole: this.bindUf('role'),
      ufPassword: this.bindUf('password'),
      submitAddUser: () => this.submitAddUser(),
      deleteUser: (username) => this.deleteUser(username),
      deleteReagent: (id) => this.deleteReagent(id),
      clearTxns: () => this.clearTxns(),
      openPrintSticker: (lot, reagent) => this.openPrintSticker(lot, reagent),
      closePrintSticker: () => this.closePrintSticker(),
      modalPrintSticker: S.modal === 'printSticker',
      printLotData: S.printLotData,
      roleCards: this.ROLES().map(r => ({ id: r.id, th: r.th, en: r.en, initials: r.initials, color: r.color, onLogin: () => this.login(r.id),
        permCount: this.PERM_LABELS().filter(p => this.state.perms[r.id][p.key]).length,
        summary: ({ admin: 'เข้าถึงและจัดการได้ทุกส่วนของระบบ รวมถึงการจัดการผู้ใช้และการตั้งค่า', supervisor: 'รับเข้า–เบิกจ่าย จัดการข้อมูลน้ำยา และรับทราบการแจ้งเตือน', technician: 'เบิกจ่ายแบบ FEFO ดูคลัง และรับทราบการแจ้งเตือน', viewer: 'ดูข้อมูลคลังน้ำยาและประวัติได้อย่างเดียว' })[r.id] })),
      permRoles: this.ROLES().map(r => ({ th: r.th, color: r.color, current: r.id === S.role, headBg: r.id === S.role ? 'var(--brand-50)' : 'transparent', headFg: r.id === S.role ? 'var(--text-primary)' : 'var(--text-secondary)' })),
      permRows: this.PERM_LABELS().map(p => ({ label: p.label, cells: this.ROLES().map(r => { const ok = !!this.state.perms[r.id][p.key]; const edit = S.role === 'admin'; return { mark: this.icon(ok ? 'Check' : 'X', 18, ok ? 'var(--green-700)' : 'var(--text-tertiary)'), cellBg: r.id === S.role ? 'rgba(43,166,198,.09)' : 'transparent', cursor: edit ? 'pointer' : 'default', onToggle: edit ? (() => this.togglePerm(r.id, p.key)) : (() => {}) }; }) })),
      myRole: (() => { const id = S.role || this.ROLES()[0].id; const r = this.ROLES().find(x => x.id === id); const m = this.state.perms[id] || {}; return { th: r.th, en: r.en, initials: r.initials, color: r.color, grantCount: this.PERM_LABELS().filter(p => m[p.key]).length }; })(),
      nav: { dashBg: ns.dash.bg, dashFg: ns.dash.fg, dashIc: ns.dash.ic, invBg: ns.inv.bg, invFg: ns.inv.fg, invIc: ns.inv.ic,
        rlistBg: ns.rlist.bg, rlistFg: ns.rlist.fg, rlistIc: ns.rlist.ic,
        alBg: ns.al.bg, alFg: ns.al.fg, alIc: ns.al.ic, auBg: ns.au.bg, auFg: ns.au.fg, auIc: ns.au.ic, pmBg: ns.pm.bg, pmFg: ns.pm.fg, pmIc: ns.pm.ic,
        helpBg: ns.help.bg, helpFg: ns.help.fg, helpIc: ns.help.ic, alertCount: alerts.length },
      go: { dashboard: () => this.nav('dashboard'), inventory: () => this.nav('inventory'), reagentLists: () => this.nav('reagent_lists'), alerts: () => this.nav('alerts'), audit: () => this.nav('audit'), perms: () => this.nav('perms'), help: () => this.nav('help'),
        alertsLink: (e) => { e.preventDefault(); this.nav('alerts'); }, auditLink: (e) => { e.preventDefault(); this.nav('audit'); } },
      isDash: dn === 'dashboard', isInv: dn === 'inventory', isReagentLists: dn === 'reagent_lists', isAlerts: dn === 'alerts', isAudit: dn === 'audit', isPerms: dn === 'perms', isHelp: dn === 'help',
      title: titles[dn][0], subtitle: titles[dn][1],
      openReceive: (rid) => this.openReceive(rid), openIssue: (rid) => this.openIssue(rid),
      kpi: { total: S.reagents.length }, kpis, dashAlerts, dashLow, recent, usageList, catStats, monthlyData, weeklyPattern, insights,
      invRows, invTabs, invTab: S.invTab, setInvTab: (v) => this.setState({ invTab: v }),
      search: S.search, onSearch: (e) => this.setState({ search: e.target.value }),
      hasInvRows: invRows.length > 0,
      detailOpen: detail != null, detail, closeDetail: () => this.closeDetail(),
      alertRows, hasAlerts: alertRows.length > 0, txnRows,
      modalReceive: S.modal === 'receive', modalIssue: S.modal === 'issue', closeModal: () => this.closeModal(),
      rf: S.rf, rfRid: this.bindRf('rid'), rfLot: this.bindRf('lot'), rfExpiry: this.bindRf('expiry'), rfQty: this.bindRf('qty'), rfSupplier: this.bindRf('supplier'), rfLoc: this.bindRf('loc'),
      reagentOpts, locOpts, supplierOpts, scanOpts, submitReceive: () => this.submitReceive(),
      iform: S.iform, ifRid: this.bindIf('rid'), ifQty: this.bindIf('qty'), ifScan: this.bindIf('scan'), ifRef: this.bindIf('ref'), ifSearchInput: this.bindIf('searchInput'), ifQrInput: this.bindIf('qrInput'), submitIssue: () => this.submitIssue(),
      scanQRCode: (code) => this.scanQRCode(code), unlinkLot: () => this.unlinkLot(), selectReagentForIssue: (rid) => this.selectReagentForIssue(rid),
      activeLotsList: S.lots.filter(l => l.qty > 0 && l.status === 'ACTIVE'),
      reagentsList: S.reagents.map(r => {
        let subUnitName = r.subUnit || '';
        if (subUnitName.includes(':')) {
          subUnitName = subUnitName.split(':')[0];
        }
        return { ...r, subUnit: subUnitName };
      }),
      onIssueLot: (rid, lotId) => this.openIssueWithLot(rid, lotId),
      issuePlanRows: plan.rows, issueShort: plan.short, issueHasPlan: plan.rows.length > 0, issueOnHand,
      issueReagentName: issueReagent ? issueReagent.th : '', issueUnit: issueReagent ? issueReagent.unit : '',
      
      // register reagent catalog
      modalRegister: S.modal === 'register',
      mform: S.mform,
      mfCode: this.bindMf('code'),
      mfTh: this.bindMf('th'),
      mfEn: this.bindMf('en'),
      mfCat: this.bindMf('cat'),
      mfUnit: this.bindMf('unit'),
      mfSubUnit: this.bindMf('subUnit'),
      mfSubUnitQty: this.bindMf('subUnitQty'),
      mfTestsPerSubUnit: this.bindMf('testsPerSubUnit'),
      mfTestsPerUnit: this.bindMf('testsPerUnit'),
      mfStorage: this.bindMf('storage'),
      mfMin: this.bindMf('min'),
      mfReorder: this.bindMf('reorder'),
      mfSupplier: this.bindMf('supplier'),
      mfImg: this.bindMf('img'),
      submitRegister: () => this.submitRegister(),
      submitEditReagent: () => this.submitEditReagent(),
      openRegister: () => this.openRegister(),
      openEditReagent: (rid) => this.openEditReagent(rid),
      editReagentId: S.editReagentId,
      role: S.role,
      canManage: this.can('manage'),
      updateReagentCategory: (id, cat) => this.updateReagentCategory(id, cat),

      // edit lot (correct qty/expiry/location of existing stock)
      openEditLot: (id) => this.openEditLot(id),
      deleteLotReceive: (id) => this.deleteLotReceive(id),
      modalEditLot: S.modal === 'editLot',
      elForm: S.elForm, elExpiry: this.bindElf('expiry'), elQty: this.bindElf('qty'), elLoc: this.bindElf('loc'),
      submitEditLot: () => this.submitEditLot(),
      editingLotData: (() => {
        const l = S.lots.find(x => x.id === S.editingLotId);
        if (!l) return null;
        const r = S.reagents.find(x => x.id === l.rid);
        return { lot: l.lot, reagentName: r ? r.th : '—', unit: r ? r.unit : '' };
      })(),

      // edit transaction (correct qty/reference of a past receive/issue/adjust record)
      modalEditTxn: S.modal === 'editTxn',
      etForm: S.etForm, etQty: this.bindEtf('qty'), etRef: this.bindEtf('ref'),
      submitEditTxn: () => this.submitEditTxn(),
      editingTxnData: (() => {
        const t = S.txns.find(x => x.id === S.editingTxnId);
        if (!t) return null;
        const r = S.reagents.find(x => x.id === t.rid);
        const l = S.lots.find(x => x.id === t.lotId);
        const m = this.txnMeta(t.type);
        return { reagentName: r ? r.th : '—', unit: r ? r.unit : '', lot: l ? l.lot : '—', typeLabel: m.label, type: t.type };
      })(),

      toast: S.toast, toastBg: S.toast ? (S.toast.kind === 'warn' ? '#5A4410' : 'var(--slate-900)') : '',
      showToast: (msg, kind) => this.showToast(msg, kind),
      sidebarOpen: S.sidebarOpen,
      toggleSidebar: () => this.setState(s => ({ sidebarOpen: !s.sidebarOpen })),
      closeSidebar: () => this.setState({ sidebarOpen: false }),
    };
  }

  render() {
    const v = this.renderVals();
    const { setRoot } = v;
    return (
<div ref={setRoot} style={css(`--surface-page:#0E1822; --surface-card:#17242E; --surface-sunken:#0B141C; --white:#17242E; --surface-inverse:#E8F0F4; --text-primary:#E8F0F4; --text-secondary:#AAC3CF; --text-tertiary:#7C96A3; --text-link:#5BC0D9; --text-on-brand:#FFFFFF; --text-disabled:#5A6E7A; --border-subtle:#22333E; --border-default:#2F4452; --border-strong:#3D5462; --border-brand:#1A93B3; --brand-900:#5FC8E0; --brand-800:#7FD3E8; --brand-700:#1A93B3; --brand-600:#2BA6C6; --brand-500:#5BC0D9; --brand-400:#8DBBCC; --brand-300:#A9C7EE; --brand-100:rgba(43,166,198,.18); --brand-50:rgba(43,166,198,.12); --accent-700:#A9C7EE; --accent-600:#4E7CB0; --accent-500:#7AA2C4; --accent-400:#93B9E1; --accent-100:rgba(122,162,196,.20); --accent-50:rgba(122,162,196,.12); --green-700:#5FD49A; --green-600:#38B673; --green-100:rgba(56,182,115,.16); --amber-700:#F0C674; --amber-600:#D69A2E; --amber-100:rgba(214,154,46,.16); --red-700:#F18C8C; --red-600:#E2685E; --red-100:rgba(226,104,94,.16); --blue-700:#8DBBCC; --blue-600:#5BC0D9; --blue-100:rgba(91,192,217,.16); --violet-700:#B9A9E8; --violet-600:#9B86D8; --violet-100:rgba(155,134,216,.18); --slate-900:#0B1922; --slate-700:#9DB1BC; --slate-600:#8DBBCC; --slate-500:#7C96A3; --slate-400:#5A6E7A; --slate-300:#3D5462; --slate-200:#2F4452; --slate-100:#1F2E39; --slate-50:#1B2933; --shadow-xs:0 1px 2px rgba(0,0,0,.4); --shadow-sm:0 1px 3px rgba(0,0,0,.5),0 1px 2px rgba(0,0,0,.4); --shadow-md:0 4px 12px -2px rgba(0,0,0,.55); --shadow-lg:0 16px 32px -8px rgba(0,0,0,.6); --glow-brand:0 10px 30px -10px rgba(0,0,0,.6); --glow-brand-soft:0 6px 18px -8px rgba(0,0,0,.5); --glow-accent:0 10px 30px -10px rgba(0,0,0,.55); --text-2xs:0.8125rem; --text-xs:0.875rem; --text-sm:0.9375rem; --text-base:1.0625rem; --text-md:1.1875rem; --text-lg:1.375rem; --text-xl:1.625rem; --text-2xl:2rem; --text-3xl:2.5rem; --text-4xl:3.25rem; display:flex; min-height:100vh; background:var(--surface-page); font-family:var(--font-body); color:var(--text-primary);`)}>
      {v.sidebarOpen && (
        <div className="sidebar-backdrop" onClick={v.closeSidebar} />
      )}
      <Sidebar v={v} />
      <Main v={v} />
      <DetailDrawer v={v} />
      <ReceiveModal v={v} />
      <IssueModal v={v} />
      <RegisterModal v={v} />
      <AddUserModal v={v} />
      <PrintStickerModal v={v} />
      <EditLotModal v={v} />
      <EditTransactionModal v={v} />
      <Toast v={v} />
      <Login v={v} />
    </div>
    );
  }
}

export default App;
