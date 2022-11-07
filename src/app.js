const path = require("path");
const express = require('express');
const useragent = require('express-useragent');
const bodyParser = require('body-parser');

const loggingRequest = require('./common/logging-request');

const app = express()

const configuration = require('./configuration/index');
const logging = require('./common/logging');
const errors = require('./common/error');
const response = require('./common/response');

const db = require("./models");

const httpHost = configuration.application.host
const httpPort = configuration.application.port

app.listen(httpPort, () => {
    logging.info('APPLICATION', `Application running on ${httpHost}:${httpPort}`);

    db.sequelize
        .authenticate()
        .then(() => {
            logging.query('DATABASE', 'Connection to Database has been established successfully.');
        })
        .catch(err => {
            logging.error(err);
        });
});

// MARK: Configuration for express
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(useragent.express());
app.use(loggingRequest.LogRequest);
app.use(loggingRequest.LogResponse);
app.use(loggingRequest.LogError);

// MARK: HTML engine
app.use(express.static(path.join(__dirname, "public")));
app.set('views', './src/public');
app.set('view engine', 'ejs');

// MARK: For handle base url response
app.get('/', function (req, res) {
    if (req.headers['content-type'] === 'application/json') {
        res.json(
            response.success(
                `Welcome to service ${configuration.application.name}`,
                null,
                200,
                "SUCCESS"
            )
        )
    } else {
        res.render('index', {
            application: configuration.application
        });
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
        res.render('error_404',{
            application: configuration.application
        });
    }

});

module.exports = app;
