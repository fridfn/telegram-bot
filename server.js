import express from 'express';
import bodyParser from 'body-parser';
import TelegramBot from 'node-telegram-bot-api';
import ngrok from '@ngrok/ngrok';
import dotenv from 'dotenv';
import { initCommands } from './bot/commands.js';
import { initEvents } from './bot/events.js';

dotenv.config();

const app = express();
app.use(bodyParser.json());

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { webHook: false });
await bot.setWebHook('https://telegram-bot-tau-ochre.vercel.app/api/telegram');

initCommands(bot);
initEvents(bot);

const PORT = 3003;

app.post('/webhook', (req, res) => {
  bot.processUpdate(req.body);
  res.send('BOT READY');
});

app.listen(PORT, async () => {
  console.log(`Server bot telegram running on http://localhost:${PORT}`);

  const listener = await ngrok.connect({ addr: PORT, authtoken_from_env: true });
  const url = listener.url();
  console.log(`Ngrok tunnel established at: ${url}`);

  await bot.setWebHook(`${url}/webhook`);
  console.log('Webhook Telegram sudah diset!');
});
