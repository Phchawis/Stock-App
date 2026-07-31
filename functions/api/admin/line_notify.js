import { json } from '../_lib.js';

// Handles BOTH the daily external scheduler (GET, no session) and the in-app
// "send now" button (POST). This path is listed as public in _middleware.js,
// so there is intentionally no session/permission gate here — see that file for
// the trade-off. The one security property kept from the hardened version: the
// error below stays generic and never lists configured secret names.
export async function onRequest(context) {
  const { env } = context;
  const channelAccessToken = env.LINE_CHANNEL_ACCESS_TOKEN;
  const groupId = env.LINE_GROUP_ID;

  if (!channelAccessToken || !groupId) {
    // Do NOT enumerate env var / secret names back to the caller.
    return json({ error: 'ยังไม่ได้ตั้งค่าการเชื่อมต่อ LINE ในระบบ กรุณาแจ้งผู้ดูแลระบบ' }, 500);
  }

  try {
    const todayBangkokStr = new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);
    
    // คิวรีดึงข้อมูลล็อตทั้งหมดที่ใกล้หมดอายุหรือหมดอายุแล้ว
    const query = `
      SELECT r.th AS name, l.lot, l.expiry, l.qty, r.unit,
             CAST(JULIANDAY(l.expiry) - JULIANDAY(?) AS INTEGER) AS days_left
      FROM lots l
      JOIN reagents r ON l.rid = r.id
      WHERE l.qty > 0 AND l.status = 'ACTIVE'
        AND (JULIANDAY(l.expiry) - JULIANDAY(?)) <= 60
      ORDER BY days_left ASC
    `;
    const { results } = await env.DB.prepare(query).bind(todayBangkokStr, todayBangkokStr).all();

    // กรองเอาเฉพาะกลุ่มสีแดง (วิกฤต: หมดอายุแล้ว หรืออายุเหลือ <= 15 วัน)
    const redAlerts = results.filter(item => item.days_left <= 15);

    if (redAlerts.length === 0) {
      return json({ success: true, message: 'ไม่มีน้ำยาเคมีระดับวิกฤต (สีแดง) ในสต็อกขณะนี้' });
    }

    // ประกอบเท็กซ์ข้อความภาษาไทย
    let messageText = `🚨 [แจ้งเตือนด่วน] น้ำยาเคมีวิกฤตใกล้หมดอายุ! (สีแดง: ≤ 15 วัน)\n`;
    messageText += `ห้องปฏิบัติการ CMTL Laboratory\n`;
    messageText += `──────────────────\n\n`;

    // LINE rejects a push whose text exceeds 5000 characters, and it rejects the
    // whole message — so on a bad week (dozens of critical lots at once) the
    // daily alert would fail outright, exactly when it matters most. Fill up to
    // a safe budget, listing the most urgent first, then say how many were cut.
    const FOOTER = `⚠️ โปรดเข้าตรวจสอบระบบ CMTL Reagent Inventory เพื่อตัดจำหน่ายหรือทำเรื่องจัดซื้อโดยเร็วครับ`;
    const BUDGET = 4600;   // headroom for the footer + the "and N more" line
    let listed = 0;
    for (const item of redAlerts) {
      const dayLabel = item.days_left < 0
        ? `หมดอายุแล้ว (ผ่านมา ${Math.abs(item.days_left)} วัน)`
        : (item.days_left === 0 ? 'หมดอายุวันนี้!' : `เหลือเวลาอีก ${item.days_left} วัน`);

      const entry =
        `${listed + 1}. 🧪 ${item.name}\n` +
        `   · Lot: ${item.lot}\n` +
        `   · คงเหลือ: ${item.qty} ${item.unit}\n` +
        `   · วันหมดอายุ: ${item.expiry} (${dayLabel})\n\n`;

      if (messageText.length + entry.length > BUDGET) break;
      messageText += entry;
      listed++;
    }

    const omitted = redAlerts.length - listed;
    if (omitted > 0) {
      messageText += `…และอีก ${omitted} รายการที่ยังไม่ได้แสดง (รวมทั้งหมด ${redAlerts.length} รายการ)\n\n`;
    }
    messageText += FOOTER;

    // ส่งข้อความไปที่ LINE Bot
    const res = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${channelAccessToken}`
      },
      body: JSON.stringify({
        to: groupId,
        messages: [{ type: 'text', text: messageText.trim() }]
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`LINE API returned ${res.status}: ${errText}`);
    }

    return json({ success: true, count: redAlerts.length, listed });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
