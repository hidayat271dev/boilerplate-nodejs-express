const chalk = require('chalk');
const { ValidationError } = require('express-validation');

const logger = require('./logging');
const constants = require("./constants");

module.exports = {

    ColoringStatusCode: code => {
        if (code >= 500) return chalk.red.bold(code);
        if (code >= 400 && code < 500) return chalk.red.bold(code);
        if (code >= 300 && code < 400) return chalk.cyan.bold(code);
        if (code >= 200 && code < 300) return chalk.green.bold(code);
        return code;
    },

    LogRequest: (req, res, next) => {
        logger.http(chalk.magentaBright('Incoming Request'), `=> ${req.method} ${req.url}`);
        next();
    },

    LogResponse: (req, res, next) => {
        res.on('finish', () => {
            logger.http(
                chalk.magentaBright('Outgoing Response'),
                `<= ${module.exports.ColoringStatusCode(res.statusCode)} ${req.method} ${chalk.bold(req.url)}`,
            );
        });
        next();
    },

    LogError: (err, req, res, next) => {
        const response = {
            statusCode: err.statusCode || 500,
            message: err.message || 'No message available',
            type: err.type,
            errorMessages: [err.details] || [],
        };

        if (process.env.NODE_ENV === constants.DEVELOPMENT_ENV) {
            response.stack = err.stack;
        }

        if (err instanceof ValidationError) {
            response.type = 'JOI_VALIDATION_ERROR';
            response.message = 'Request cannot be process';
            response.errorMessages = [err.details];

            _.isEmpty(req.body) ? logger.debug('Joi', 'Validation Error') : logger.debug('Joi', 'Validation Error', req.body);
            logger.error(_.omit(err, 'details'));
        } else {
            logger.error(err);
        }

        res.status(response.statusCode).json(response);
    }
};
