const winston = require('winston');

// Configure logger with timestamp and log levels
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({ 
            filename: 'logs/error.log', 
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        new winston.transports.File({ 
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    ]
});

// Mask sensitive data before logging
const maskSensitiveData = (data) => {
    if (typeof data !== 'object') return data;
    
    const masked = { ...data };
    const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'credit_card'];
    
    for (const field of sensitiveFields) {
        if (masked[field]) {
            masked[field] = '********';
        }
    }
    
    return masked;
};

// Export helper functions for consistent logging
module.exports = {
    info: (message, data = {}) => {
        logger.info(message, maskSensitiveData(data));
    },
    error: (message, error = {}) => {
        logger.error(message, maskSensitiveData(error));
    },
    debug: (message, data = {}) => {
        logger.debug(message, maskSensitiveData(data));
    },
    warn: (message, data = {}) => {
        logger.warn(message, maskSensitiveData(data));
    }
};