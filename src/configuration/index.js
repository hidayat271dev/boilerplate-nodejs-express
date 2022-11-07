require('dotenv').config();

const config = {
    application: {
        name: process.env.APPLICATION_NAME || "NO_NAME",
        host: process.env.HOST || "http://localhost",
        port: process.env.PORT || 3000
    },
    database: {
        development: {
            username: process.env.PG_USER,
            password: process.env.PG_PASSWORD,
            database: process.env.PG_DATABASE,
            host: process.env.PG_HOST,
            port: process.env.PG_PORT,
            dialect: "postgres",
            logging: false,
        },
        test: {
            username: process.env.PG_USER,
            password: process.env.PG_DATABASE,
            database: process.env.PG_PASSWORD,
            host: process.env.PG_HOST,
            port: process.env.PG_PORT,
            dialect: "postgres",
            logging: false,
        },
        production: {
            username: process.env.PG_USER,
            password: process.env.PG_DATABASE,
            database: process.env.PG_PASSWORD,
            host: process.env.PG_HOST,
            port: process.env.PG_PORT,
            dialect: "postgres",
        },
    }
};

module.exports = config;
