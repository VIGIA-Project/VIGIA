import { Injectable, LoggerService, Scope } from '@nestjs/common';
import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.DEFAULT })
export class VigiaLogger implements LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    const logLevel = process.env.LOG_LEVEL ?? 'debug';
    const isProduction = process.env.NODE_ENV === 'production';

    this.logger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        isProduction
          ? winston.format.json()
          : winston.format.combine(
              winston.format.colorize(),
              winston.format.printf(({ timestamp, level, message, context, trace }) => {
                const ctx = context ? `[${context}]` : '';
                const traceStr = trace ? `\n${trace}` : '';
                return `${timestamp} ${level} ${ctx} ${message}${traceStr}`;
              }),
            ),
      ),
      transports: [
        new winston.transports.Console(),
        ...(isProduction
          ? [
              new winston.transports.File({
                filename: process.env.LOG_FILE_PATH ?? 'logs/vigia.log',
                maxsize: 10 * 1024 * 1024, // 10MB
                maxFiles: 5,
                tailable: true,
              }),
            ]
          : []),
      ],
    });
  }

  log(message: string, context?: string): void {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string): void {
    this.logger.verbose(message, { context });
  }
}
