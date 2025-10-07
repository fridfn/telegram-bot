export function initCommands(bot) {
    console.log({bot})
  bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, `Halo ${msg.from.first_name}! Bot aktif 💜`);
    console.log(msg)
  });

  bot.onText(/\/echo (.+)/, (msg, match) => {
    const resp = match[1];
    bot.sendMessage(msg.chat.id, resp);
  });
}
