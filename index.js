const {gameOptions, gameAgainOptions} = require('./options')

const TelegramApi = require('node-telegram-bot-api');

const token = "5998712881:AAG79jxJPU41DyFeayiZWdm5juhhT8tGRy8";

const bot = new TelegramApi(token, {polling: true});

const chats = {};

const startGame = async (chat_id) => {
    let game_tries = 4;
    await bot.sendMessage(chat_id, "Я загадываю цифру от 0 до 10, а ты должен её угадать.");
    chats[chat_id] = [Math.floor(Math.random() * 10), game_tries];
    await bot.sendMessage(chat_id, `Отгадывай, у тебя ${chats[chat_id][1]} попытки`, gameOptions);
}

const start = (bot) => {

    bot.setMyCommands([
        {command: "/start", description: "Начальное приветствие"},
        {command: "/info", description: "Информация о боте"},
        {command: "/game", description: "Игра угадайка"},
    ])

    bot.on("message", async msg => {
        const message = msg.text;
        const chat_id = msg.chat.id;

        if (message === '/start') {
            await bot.sendMessage(chat_id, "Привет даун");
        }
        else if (message === "/info") {
            await bot.sendMessage(chat_id, "Это тестовый бот");
        }
        else if (message === "/game") {
            await startGame(chat_id);
        }
        else {
            await bot.sendMessage(chat_id, `Ты написал мне: ${message}`);
        }
    });

    bot.on("callback_query", async msg => {
        const data = msg.data;
        const chat_id = msg.message.chat.id;

        if (data === "/again") {
            await startGame(chat_id);
        }
        else {
            if (chats[chat_id][0].toString() === data) {
                await bot.sendMessage(chat_id, `Ты угадал!`, gameAgainOptions);
            } else {
                --chats[chat_id][1];
                if (chats[chat_id][1] <= 0) {
                    await bot.sendMessage(chat_id, "У тебя закончились попытки, ты проиграл.");
                    await bot.sendMessage(chat_id, `Число, которое я загадал, было: ${chats[chat_id][0]}`, gameAgainOptions);
                } else {
                    await bot.sendMessage(chat_id, `Неверно. Осталось попыток ${chats[chat_id][1]}`);
                    await bot.sendMessage(chat_id, `(Подсказка для писечки: число которое я загадал это ${chats[chat_id][0]}`);
                }
            }
        }

    })
}

start(bot);
