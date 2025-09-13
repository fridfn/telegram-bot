// api/telegram.js
import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

// handler API Vercel
export default async function handler(req, res) {
 console.log("TOKEN TELEGRAM:", process.env.TELEGRAM_BOT_TOKEN ? "✅ ADA" : "❌ KOSONG");
  if (req.method === "POST") {
    try {
      await bot.processUpdate(req.body);
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("processUpdate error:", err);
      return res.status(500).json({ error: "failed" });
    }
  }
  return res.status(200).send("Hello from bot endpoint");
}

// example listener
bot.on("message", (msg) => {
  bot.sendMessage(msg.chat.id, "Halo Farid 👋 aku hidup di Vercel nih!");
});


// import dotenv from 'dotenv';
// import TelegramBot from 'node-telegram-bot-api';
// import { initCommands } from '../bot/commands.js'
// import { initEvents } from '../bot/events.js';
// 
// dotenv.config();
// 
// const token = process.env.TELEGRAM_BOT_TOKEN;
// const bot = new TelegramBot(token, { webHook: false }); // serverless, kita handle request sendiri
// 
// Inisialisasi commands & events
// initCommands(bot);
// initEvents(bot);
// 
// Vercel handler
// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     bot.processUpdate(req.body);
//     res.status(200).send('BOT READY');
//   }
//   
//   if (req.method === 'GET') {
//     await bot.setWebHook("https://telegram-bot-tau-ochre.vercel.app/api/telegram");
//     return res.status(200).send('Webhook set!');
//   }
//   
//   res.status(405).send('Method Not Allowed');
// }
// 