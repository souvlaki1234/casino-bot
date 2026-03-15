const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf('8791302144:AAFnZEVmgZG0Yu4hnA0jMMS4ZDdQa0u7ryE');
const WEBAPP_URL = 'https://souvlaki1234.github.io/casino-bot/';

const roflMessages = [
  '🦅 БРАТАН! Твой долг перед казино составляет {debt} монет. Ждём оплаты наличными.',
  '💀 Уважаемый клиент, вы должны нам {debt} монет. Высылаем коллекторов.',
  '🤡 ХА-ХА-ХА! Долг: {debt} монет. Может займёшь у мамы?',
  '😈 Казино напоминает: ваш долг {debt} монет. Почка принимается как оплата.',
  '🚨 ВНИМАНИЕ! Задолженность {debt} монет. Судебные приставы уже выехали.',
  '💸 Дорогой проигравший, долг {debt} монет. Продай велосипед.',
];

const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf('ВАШ_ТОКЕН'); // 👈 вставь свой токен

const WEBAPP_URL = 'https://souvlaki1234.github.io/casino-bot/';

// Хранилище должников { userId: { amount, name } }
const debtors = {};

const roflMessages = [
  '🦅 Привет, {name}! Твой долг перед казино: {debt} монет. Ждём оплаты наличными.',
  '💀 Уважаемый {name}, вы должны нам {debt} монет. Высылаем коллекторов.',
  '🤡 ХА-ХА-ХА! {name}, долг: {debt} монет. Может займёшь у мамы?',
  '😈 Казино напоминает, {name}: твой долг {debt} монет. Почка принимается как оплата.',
  '🚨 ВНИМАНИЕ! {name} задолжал {debt} монет. Судебные приставы уже выехали.',
  '💸 Дорогой {name}, долг {debt} монет. Продай велосипед.',
  '🎰 {name}, казино не забывает своих должников. Долг: {debt} монет.',
  '😤 {name}! {debt} монет! Когда отдашь?! Казино ждёт!',
];

function getRofl(name, debt) {
  const msg = roflMessages[Math.floor(Math.random() * roflMessages.length)];
  return msg.replace('{name}', name).replace('{debt}', debt.toLocaleString('de-DE'));
}

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
    const userId = ctx.from.id;
    const name = ctx.from.first_name || 'Игрок';

    if (data.type === 'debt' && data.amount > 0) {
      debtors[userId] = { amount: data.amount, name };
      ctx.reply(getRofl(name, data.amount));
    } else if (data.type === 'paid') {
      delete debtors[userId];
    }
  } catch (e) {}
});

// Каждые 5 минут напоминаем всем должникам
setInterval(() => {
  const ids = Object.keys(debtors);
  if (ids.length === 0) return;

  ids.forEach(userId => {
    const { amount, name } = debtors[userId];
    bot.telegram.sendMessage(userId, getRofl(name, amount))
      .catch(() => delete debtors[userId]);
  });
}, 5 * 60 * 1000);

bot.launch();
console.log('Бот запущен...');