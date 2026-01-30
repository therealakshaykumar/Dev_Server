import winston from "winston";
import { App } from "../configs/creds.js";
import fs from "fs";
import path from "path";

// Create logs directory if it doesn't exist
const logsDir = 'logs';
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

export const Logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json(),
        winston.format.printf(({ level, message, timestamp }) => {
            return `${level} - ${message} - ${timestamp} `;
        })
    ),
    transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.printf(({ level, message, timestamp }) => {
                        return `${level} - ${timestamp} - ${message}`;
                    })
                )
            })
    ]
})