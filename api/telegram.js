// ./api/telegram-webhook.js
import kv from '@vercel/kv';

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const body = req.body;

  // 1) RESPOND CEPAT ke Telegram supaya dia gak retry
  //    (kita akan proses di background setelah ini)
  res.status(200).end();

  try {
    const updateId = body.update_id;
    if (!updateId) {
      console.log('No update_id, skipping');
      return;
    }

    // 2) Key untuk menandai bahwa update ini sudah diproses
    const processedKey = `tg:processed:${updateId}`;

    // 3) Coba set key secara ATOMIC hanya jika belum ada (NX) + TTL
    //    TTL sesuaikan: 1 jam / 24 jam / dsb. (disini contoh 24 jam)
    const ttlSeconds = 60 * 60 * 24;

    // NOTE: @vercel/kv supports set options (nx, ex). Jika versi berbeda,
    // cek dokumentasi / test behavior pada projectmu.
    const setResult = await kv.set(processedKey, '1', { nx: true, ex: ttlSeconds });

    // setResult biasanya truthy jika berhasil set (key belum ada),
    // falsy jika key sudah ada (sudah diproses).
    if (!setResult) {
      console.log('Duplicate update detected, skipping:', updateId);
      return;
    }

    // 4) Kalau sampai sini, artinya kita owner dari update ini -> proses
    const message = body.message ?? body.callback_query?.message;
    if (!message) {
      console.log('No message payload, maybe inline/callback - skipping for now');
      return;
    }

    const chatId = message.chat.id;
    const text = message.text || '<non-text message>';

    // contoh respons ke user — kamu bisa switch logic sesuai botmu
    await fetch(`${TELEGRAM_API}/api/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `Terima kasih, aku terima pesanmu: ${text}`
      })
    });

    console.log('Processed updateId:', updateId);
  } catch (err) {
    // error handling: log aja, jangan kirim 500 ke Telegram karena udah kita ack
    console.error('Handler processing error:', err);
  }
}
