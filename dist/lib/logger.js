import winston from "winston";
export const Logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.json(), winston.format.printf(({ level, message, timestamp }) => {
        return `${level} - ${message} - ${timestamp} `;
    })),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.printf(({ level, message, timestamp }) => {
                return `${level} - ${timestamp} - ${message}`;
            }))
        })
    ]
});
