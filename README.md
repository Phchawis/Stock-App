# ระบบจัดการ Stock น้ำยา · TUH Reagent Inventory

ระบบจัดการคลังน้ำยาห้องปฏิบัติการเทคนิคการแพทย์ (prototype)
แปลงจาก Claude Design prototype มาเป็น **React + Vite app** มาตรฐาน เพื่อพัฒนาต่อได้

## เทคโนโลยี

- **React 18** + **Vite 6** (JSX, ES modules)
- **lucide** — ไอคอน (โหลดผ่าน npm)
- ฟอนต์ไทย self-hosted (Anuphan / Sarabun / IBM Plex Mono) ใน `public/assets/`
- ไม่มี backend — ข้อมูลทั้งหมดเป็น mock data ในหน่วยความจำ

## วิธีรัน

```bash
npm install
npm run dev        # เปิด http://localhost:5173
```

คำสั่งอื่น:

```bash
npm run build      # build ไป dist/
npm run preview    # ดู production build
```

## บัญชีสาธิต

รหัสผ่านทุกบัญชี: `tuh1234`

| Username | บทบาท | สิทธิ์ |
|---|---|---|
| `admin` | ผู้ดูแลระบบ | ทุกอย่าง รวมจัดการผู้ใช้/ตั้งค่า |
| `supervisor` | หัวหน้าคลังน้ำยา | รับเข้า–เบิกจ่าย จัดการน้ำยา รับทราบแจ้งเตือน |
| `technician` | นักเทคนิคการแพทย์ | เบิกจ่าย FEFO ดูคลัง รับทราบแจ้งเตือน |
| `viewer` | ผู้ดูข้อมูล | ดูอย่างเดียว |

(หน้า login มีปุ่ม "เลือกบัญชีสาธิต" กดเข้าได้เลยโดยไม่ต้องพิมพ์)

## ฟีเจอร์

- **แดชบอร์ด** — KPI, การแจ้งเตือนใกล้หมดอายุ/ต่ำกว่าจุดสั่งซื้อ, ความเคลื่อนไหวล่าสุด
- **คลังน้ำยา** — รายการน้ำยา + สถานะคงคลัง พร้อมตัวกรอง (Tabs) และค้นหา
- **รับเข้า (Receive)** และ **เบิกจ่ายแบบ FEFO** (First-Expiry-First-Out)
- **ประวัติการเคลื่อนไหว** (Audit Trail)
- **สิทธิ์การใช้งาน** ตามบทบาท 4 ระดับ (admin แก้สิทธิ์ได้)

## โครงสร้างโปรเจกต์

```
src/
  App.jsx              state + logic + renderVals() (ส่ง view-model ให้ component ย่อย)
  main.jsx             entry point + lucide setup + ErrorBoundary
  css.js               helper แปลง CSS string → React style object
  styles.css           design tokens, @font-face, keyframes, utility classes
  layout/
    Sidebar.jsx        เมนูข้าง
    Main.jsx           แถบบน + พื้นที่หลัก (ประกอบ 5 หน้าจอ)
  screens/
    Dashboard.jsx  Inventory.jsx  Alerts.jsx  Audit.jsx  Perms.jsx
    DetailDrawer.jsx  ReceiveModal.jsx  IssueModal.jsx  Login.jsx
  components/
    Input.jsx  Select.jsx  Tabs.jsx  Toast.jsx
public/assets/         ฟอนต์ (.woff2) + โลโก้ (.png)
```

> ทุก component ย่อยรับ view-model `v` จาก `App.renderVals()` แล้ว destructure
> เฉพาะ key ที่ใช้ — ข้อมูล/handler ทั้งหมดอยู่ใน `renderVals()` ที่เดียว

> รายละเอียดสถาปัตยกรรมสำหรับการพัฒนาต่อ (รวมการพัฒนาด้วย AI tool อื่น) อยู่ใน [CLAUDE.md](CLAUDE.md)

## หมายเหตุ

- ข้อมูลอยู่ในหน่วยความจำ — รีเฟรชหน้าแล้วกลับเป็นค่าเริ่มต้น
- วันที่อ้างอิงของระบบถูกตรึงไว้ที่ **2026-06-29** (`this.today` ใน `App.jsx`) เพื่อให้สถานะหมดอายุของ mock data คงที่
