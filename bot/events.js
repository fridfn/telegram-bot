export function initEvents(bot) {
  bot.on('message', (msg) => {
    console.log('Pesan masuk:', msg.text);
  });

  bot.on('callback_query', (query) => {
    bot.answerCallbackQuery(query.id, { text: 'Tombol ditekan!' });
  });
}
