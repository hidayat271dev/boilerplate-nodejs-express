const chalk = require('chalk');
const winston = require('winston');
const expressWinston = require('express-winston');
const winstonDailyRotateFile = require("winston-daily-rotate-file");
const {
    PRODUCTION_ENV,
    VERBOSE_LOGGING_LVL,
    INFO_LOGGING_LVL,
} = require('./constants');

const getCustomFormat = winston.format.printf(logInfo => {
    switch (logInfo.level) {
        case 'info':
            console.log( `${chalk.bgGreen(logInfo.level.toUpperCase() +  ' [' + logInfo.label + ']' + ' ' + logInfo.timestamp + ' ')} ${logInfo.message} ${(Object.keys(logInfo.metadata).length !== 0 ? JSON.stringify(logInfo.metadata) : '')} `);
            break;
        default:
            console.log( `${chalk.bgRed(logInfo.level.toUpperCase() + ' [' + logInfo.label + ']' + ' ' + logInfo.timestamp + ' ')} ${logInfo.message} ${(Object.keys(logInfo.metadata).length !== 0 ? JSON.stringify(logInfo.metadata) : '')} `);
            break;
    }
    return `${logInfo.level.toUpperCase()} [${logInfo.label}]\t${logInfo.timestamp}\t${logInfo.message} ${(Object.keys(logInfo.metadata).length !== 0 ? JSON.stringify(logInfo.metadata) : '')} `;
});

const getTransports = () => {
    return [
        new winstonDailyRotateFile({
            filename: 'logs/log-application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        }),
        new winstonDailyRotateFile({
            level: 'error',
            filename: 'logs/errors/log-error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        }),
        // new winston.transports.Console(),
    ];
};

const getFormat = () => winston.format.combine(
    winston.format.metadata(),
    winston.format.label({
        label: "APPLICATION"
    }),
    winston.format.timestamp({
        format: "YYYY-MM-DDTHH:mm:ss.sssZ"
    }),
    winston.format.json(),
    winston.format.prettyPrint(),
    getCustomFormat
);

const requestLogger = expressWinston.logger({
    colorize: false,
    expressFormat: true,
    meta: true,
    transports: getTransports(),
    format: getFormat(),
});

const errorLogger = expressWinston.errorLogger({
    format: getFormat(),
    transports: getTransports(),
});

const logger = winston.createLogger({
    level: process.env.NODE_ENV !== PRODUCTION_ENV ? VERBOSE_LOGGING_LVL : INFO_LOGGING_LVL,
    format: getFormat(),
    transports: getTransports(),
});

module.exports = {
    requestLogger,
    errorLogger,
    raw: logger,
    error: logger.error.bind(logger),
    warn: logger.warn.bind(logger),
    info: logger.info.bind(logger),
    log: logger.log.bind(logger),
    verbose: logger.verbose.bind(logger),
    debug: logger.debug.bind(logger),
    silly: logger.silly.bind(logger),
};
