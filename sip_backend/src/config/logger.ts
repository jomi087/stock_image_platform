import { createLogger, format, transports } from 'winston';
import path from 'path';
import fs from 'fs';

const logDir = path.join(__dirname, '../../logs'); //project-root/

// Ensure directories exist
fs.mkdirSync(path.join(logDir, 'combined'), { recursive: true });
fs.mkdirSync(path.join(logDir, 'error'), { recursive: true });

const isProd = process.env.NODE_ENV === 'production';

export const logger = createLogger({
  level: isProd ? 'info' : 'debug',
  format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
  transports: [
    new transports.File({
      filename: path.join(logDir, 'error', 'error.log'),
      level: 'error',
    }),

    // All logs
    new transports.File({
      filename: path.join(logDir, 'combined', 'combined.log'),
      level: 'info',
    }),
  ],
});

if (true /*!isProd*/) {
  logger.add(
    new transports.Console({
      level: 'debug',
      format: format.combine(format.timestamp(), format.simple()),
    }),
  );
}

/*
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};
*/
