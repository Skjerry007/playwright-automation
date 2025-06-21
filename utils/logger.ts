import winston from 'winston';
import path from 'path';
import chalk from 'chalk';

export class Logger {
  private logger: winston.Logger;
  private context: string;

  constructor(context: string = 'Default') {
    this.context = context;
    
    // Create logs directory if it doesn't exist
    const logsDir = path.join(process.cwd(), 'logs');
    
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { context: this.context },
      transports: [
        // Console transport with colors
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, context, stack }) => {
              const coloredContext = chalk.cyan(`[${context}]`);
              const coloredTimestamp = chalk.gray(timestamp);
              let coloredMessage = message;
              
              if (level === 'error') {
                coloredMessage = chalk.red(message);
              } else if (level === 'warn') {
                coloredMessage = chalk.yellow(message);
              } else if (level === 'info') {
                coloredMessage = chalk.green(message);
              } else if (level === 'debug') {
                coloredMessage = chalk.blue(message);
              }
              
              let log = `${coloredTimestamp} ${level.toUpperCase()} ${coloredContext} ${coloredMessage}`;
              if (stack) {
                log += `\n${chalk.red(stack)}`;
              }
              return log;
            })
          )
        }),
        
        // File transport for all logs
        new winston.transports.File({
          filename: path.join(logsDir, 'combined.log'),
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        
        // Separate file for error logs
        new winston.transports.File({
          filename: path.join(logsDir, 'error.log'),
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        
        // Separate file for test execution logs
        new winston.transports.File({
          filename: path.join(logsDir, 'test-execution.log'),
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, context }) => {
              return `${timestamp} [${context}] ${level.toUpperCase()}: ${message}`;
            })
          )
        })
      ]
    });
  }

  info(message: string, meta?: any) {
    this.logger.info(message, meta);
  }

  error(message: string, error?: Error, meta?: any) {
    this.logger.error(message, { error: error?.stack, ...meta });
  }

  warn(message: string, meta?: any) {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta?: any) {
    this.logger.debug(message, meta);
  }

  // Special methods for test logging
  testStart(testName: string) {
    this.info(`🚀 Starting test: ${testName}`);
  }

  testEnd(testName: string, status: 'PASSED' | 'FAILED' | 'SKIPPED') {
    const emoji = status === 'PASSED' ? '✅' : status === 'FAILED' ? '❌' : '⏭️';
    this.info(`${emoji} Test ${status}: ${testName}`);
  }

  step(stepName: string) {
    this.info(`📋 Step: ${stepName}`);
  }

  assertion(description: string, result: boolean) {
    const emoji = result ? '✅' : '❌';
    this.info(`${emoji} Assertion: ${description}`);
  }
} 