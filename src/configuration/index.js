require('dotenv').config();

const config = {
    application: {
        name: process.env.APPLICATION_NAME || "NO_NAME",
        host: process.env.HOST || "http://localhost",
        port: process.env.PORT || 3000
    },
    database: {

    }
};

module.exports = config;
