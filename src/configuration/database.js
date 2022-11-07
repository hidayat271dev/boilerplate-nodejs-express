const config = require('./index')

module.exports = {
  development: {
    username: config.database.development.username,
    password: config.database.development.password,
    database: config.database.development.database,
    host: config.database.development.host,
    port: config.database.development.port,
    dialect: "postgres",
    logging: false,
  },
  test: {
    username: config.database.test.username,
    password: config.database.test.password,
    database: config.database.test.database,
    host: config.database.test.host,
    port: config.database.test.port,
    dialect: "postgres",
    logging: false,
  },
  production: {
    username: config.database.production.username,
    password: config.database.production.password,
    database: config.database.production.database,
    host: config.database.production.host,
    port: config.database.production.port,
    dialect: "postgres",
  },
};
