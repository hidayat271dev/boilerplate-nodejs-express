const path = require("path");
const express = require('express');
const useragent = require('express-useragent');

const loggingRequest = require('./common/logging-request');

const app = express()

const configuration = require('./configuration/index');
const logging = require('./common/logging');
const errors = require('./common/error');
const response = require('./common/response');

const httpHost = configuration.application.host
const httpPort = configuration.application.port

const server = app.listen(httpPort, () => {
    logging.info('APPLICATION', `Application running on ${httpHost}:${httpPort}`);
});

app.use(useragent.express());
app.use(loggingRequest.LogRequest);
app.use(loggingRequest.LogResponse);
app.use(loggingRequest.LogError);

// HTML engine
app.use(express.static(path.join(__dirname, "public")));
app.set('views', './src/public');
app.set('view engine', 'ejs');

app.get('/', function (req, res, next) {
    if (req.headers['content-type'] === 'application/json') {
        res.json(
            response.success(
                `Welcome to service...`,
                null,
                200,
                "SUCCESS"
            )
        )
    } else {
        res.render('index');
    }
});

// MARK: For handle not found url
app.use(async (req, res) => {
    if (req.headers['content-type'] === 'application/json') {
        const notFoundError = new errors.default.NotFound();
        res.json(
            response.error(
                "Request URL not found, please check again the URL or method",
                notFoundError.status,
                notFoundError.code,
                { method: req.method, url: req.url}
            )
        )
    } else {
        res.render('error_404');
    }

});

module.exports = app;
