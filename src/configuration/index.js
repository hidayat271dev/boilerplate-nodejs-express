require('dotenv').config();

const config = {
    application: {
        host: process.env.HOST || "http://localhost",
        port: process.env.PORT || 3000
    },
    database: {

    }
};

module.exports = config;
