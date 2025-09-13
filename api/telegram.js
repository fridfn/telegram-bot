import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import { initCommands } from '../bot/commands.js'
import { initEvents } from '../bot/events.js';

dotenv.config();

const webHook = process.env.WEBHOOK_VALUE;
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { webHook: webHook }); // serverless, kita handle request sendiri

// Inisialisasi commands & events
initCommands(bot);
initEvents(bot);

// Vercel handler
export default async function handler(req, res) {
  if (req.method === 'POST') {
    bot.processUpdate(req.body);
    res.status(200).send('BOT READY');
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
