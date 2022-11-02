const winston = require('winston');
const winstonDailyRotateFile = require("winston-daily-rotate-file");
const moment = require("moment");

const constants = require("./constants");

const LOG_FORMAT = info => {
    const status = info.status ? info.status : '';
    const name = info.name ? ` ${info.name} :` : '';

    const details = info.details ? `\n[DETAILS] ${JSON.stringify(info.details, null, 2)}` : '';
    const stack = info.stack ? `\n[STACK] ${info.stack}` : ' ';

    return `${moment(info.timestamp).format('YYYY-MM-DD HH:mm:ssZ')} [${info.level}] ${status} ${name} ${info.message} ${details} ${stack}`;
};


const LEVEL = Symbol.for('level');

const customFormat = winston.format.printf(LOG_FORMAT);

const levelUpperCaseFormat = winston.format(info => {
    info.level = info.level.toUpperCase()

    return info
});

/**
 * Log only the messages the match `level`.
 */
function filterOnly(level) {
    // eslint-disable-next-line consistent-return
    return winston.format(info => {
        if (info[LEVEL] === level) {
            return info;
        }
    })();
}

const customColors = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
        query: 5,
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'cyan',
        debug: 'blue',
        query: 'gray',
    },
};
const logger = winston.createLogger({
    level: process.env.NODE_ENV !== constants.PRODUCTION_ENV ? constants.QUERY_LOGGING_LVL : constants.INFO_LOGGING_LVL,
    levels: customColors.levels,
    format: winston.format.combine(levelUpperCaseFormat(), winston.format.timestamp(), customFormat),
    transports: [],
    exitOnError: false,
});

winston.addColors(customColors.colors);

if (process.env.NODE_ENV !== constants.DEVELOPMENT_ENV) {
    logger.add(new winston.transports.File({ filename: `${constants.DIR_LOGS}/info.log`, format: filterOnly('info'), level: 'info' }));
    logger.add(new winston.transports.File({ filename: `${constants.DIR_LOGS}/error.log`, format: filterOnly('error'), level: 'error' }));
    logger.add(new winston.transports.File({ filename: `${constants.DIR_LOGS}/debug.log`, format: filterOnly('debug'), level: 'debug' }));
    logger.add(
        new winstonDailyRotateFile({
            filename: `${constants.DIR_LOGS}/combined/%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'debug',
        }),
    );
}

if (process.env.NODE_ENV !== constants.PRODUCTION_ENV) {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(levelUpperCaseFormat(), winston.format.timestamp(), winston.format.colorize(), customFormat),
            stderrLevels: ['error'],
        }),
    );
}

module.exports = {
    error: ({ name, status, message, details, stack }) => logger.error({ name, status, message, details, stack }),
    warn: (name, message, details) => logger.warn({ name, message, details }),
    info: (name, message, details) => logger.info({ name, message, details }),
    http: (name, message, details) => logger.http({ name, message, details }),
    debug: (name, message, details) => logger.debug({ name, message, details }),
    query: (name, message, details) => logger.query({ name, message, details }),
};
