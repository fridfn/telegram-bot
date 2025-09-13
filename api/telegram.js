import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import { initCommands } from '../bot/commands.js'
import { initEvents } from '../bot/events.js';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { webHook: false }); // serverless, kita handle request sendiri

// Inisialisasi commands & events
initCommands(bot);
initEvents(bot);

// Vercel handler
export default async function handler(req, res) {
  if (req.method === 'POST') {
    bot.processUpdate(req.body);
    res.status(200).send('BOT READY');
  }
  
  if (req.method === 'GET') {
    await bot.setWebHook("https://telegram-bot-tau-ochre.vercel.app/api/telegram");
    return res.status(200).send('Webhook set!');
  }
  
  res.status(405).send('Method Not Allowed');
}
