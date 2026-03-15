const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf('ВАШ_ТОКЕН'); // 👈 вставь свой токен

const WEBAPP_URL = 'https://souvlaki1234.github.io/casino-bot/';

const roflMessages = [
  '🦅 БРАТАН! Твой долг перед казино составляет {debt} монет. Ждём оплаты наличными.',
  '💀 Уважаемый клиент, вы должны нам {debt} монет. Высылаем коллекторов.',
  '🤡 ХА-ХА-ХА! Долг: {debt} монет. Может займёшь у мамы?',
  '😈 Казино напоминает: ваш долг {debt} монет. Почка принимается как оплата.',
  '🚨 ВНИМАНИЕ! Задолженность {debt} монет. Судебные приставы уже выехали.',
  '💸 Дорогой проигравший, долг {debt} монет. Продай велосипед.',
];

bot.command('start', (ctx) => {
  const isGroup = ctx.chat.type === 'group' || ctx.chat.type === 'supergroup';
  if (isGroup) {
    ctx.reply('🎰 Добро пожаловать в казино!\n\n👇 Нажми ссылку чтобы открыть игру:\n' + WEBAPP_URL);
  } else {
    ctx.reply(
      '🎰 Добро пожаловать в казино!\n\nНажми кнопку чтобы открыть игру!',
      Markup.inlineKeyboard([
        Markup.button.webApp('🎰 Открыть казино!', WEBAPP_URL)
      ])
    );
  }
});

bot.on('web_app_data', (ctx) => {
  try {
    const data = JSON.parse(ctx.webAppData.data);
    if (data.type === 'debt' && data.amount > 0) {
      const msg = roflMessages[Math.floor(Math.random() * roflMessages.length)];
      ctx.reply(msg.replace('{debt}', data.amount.toLocaleString('de-DE')));
    }
  } catch (e) {}
});

bot.launch();
console.log('Бот запущен...');