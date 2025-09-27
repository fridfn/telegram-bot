import { Redis } from "@upstash/redis";
import TelegramBot from "node-telegram-bot-api";
import { initCommands } from './bot/commands.js';
import { initEvents } from './bot/events.js';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { webHook: true });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const body = req.body;
  // ACK cepat
  res.status(200).end();

  try {
    const updateId = body.update_id;
    if (!updateId) return;

    const key = `tg:processed:${updateId}`;
    const setResult = await redis.set(key, "1", { nx: true, ex: 86400 });

    if (!setResult) {
      console.log("Duplicate update, skip:", updateId);
      return;
    }
    
    initCommands(bot);
    initEvents(bot);
    
    // Proses update
    await bot.processUpdate(body);

    console.log("Processed updateId:", updateId);
  } catch (err) {
    console.error("Handler error:", err);
  }
}