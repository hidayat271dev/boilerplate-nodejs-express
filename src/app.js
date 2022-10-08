const express = require('express')

const app = express()

const configuration = require('./configuration/index');
const logging = require('./common/logging');

const httpHost = configuration.application.host
const httpPort = configuration.application.port

app.use(logging.requestLogger)
app.use(logging.errorLogger)

app.get('/', function (req, res) {
    res.send('Hello World')
})

const server = app.listen(httpPort, () => {
    logging.info(`Application running on ${httpHost}:${httpPort}`);
});

module.exports = app;
