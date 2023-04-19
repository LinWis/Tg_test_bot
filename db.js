const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
    'telegram_db',
    'progxy',
    '68305eetR_1',
    {
        host: "82.202.198.93",
        port: "6432",
        dialect: "postgres"
    }
)
