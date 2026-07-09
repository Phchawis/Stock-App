import { json } from '../_lib.js';

export async function onRequest(context) {
  const { env } = context;
  const channelAccessToken = env.LINE_CHANNEL_ACCESS_TOKEN;
  const groupId = env.LINE_GROUP_ID;

  if (!channelAccessToken || !groupId) {
    const keys = Object.keys(env || {}).filter(k => k !== 'DB'); // Exclude DB binding for security/clarity
    return json({ error: `ยังไม่ได้ระบุโทเค็น LINE_CHANNEL_ACCESS_TOKEN หรือ LINE_GROUP_ID ในระบบ Cloudflare (คีย์ที่อ่านได้: ${keys.join(', ') || 'ไม่มีเลย'})` }, 500);
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

    redAlerts.forEach((item, idx) => {
      const dayLabel = item.days_left < 0 
        ? `หมดอายุแล้ว (ผ่านมา ${Math.abs(item.days_left)} วัน)` 
        : (item.days_left === 0 ? 'หมดอายุวันนี้!' : `เหลือเวลาอีก ${item.days_left} วัน`);
        
      messageText += `${idx + 1}. 🧪 ${item.name}\n`;
      messageText += `   · Lot: ${item.lot}\n`;
      messageText += `   · คงเหลือ: ${item.qty} ${item.unit}\n`;
      messageText += `   · วันหมดอายุ: ${item.expiry} (${dayLabel})\n\n`;
    });

    messageText += `⚠️ โปรดเข้าตรวจสอบระบบ CMTL Reagent Inventory เพื่อตัดจำหน่ายหรือทำเรื่องจัดซื้อโดยเร็วครับ`;

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

    return json({ success: true, count: redAlerts.length });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
