const logging = require('./logging');

const success = (message, results, status, code, meta = null) => {
    logging.info("RESPONSE", message, {results, status, code, meta})
    return {
        message,
        error: false,
        code: code,
        status: status,
        ...meta,
        results,
    };
};

const error = (message, status, code, meta = null) => {
    logging.error({
        name: "RESPONSE",
        message: message,
        status: status,
        details: {status, code, meta}
    })
    return {
        message,
        error: true,
        code: code,
        status: status,
        ...meta,
    };
};

module.exports = {success, error}
