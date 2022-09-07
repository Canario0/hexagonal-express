import winston, { Logger as WinstonLoggerType } from "winston";
import Logger from "../domain/logger";

export default class WinstonLogger implements Logger {
  private logger: WinstonLoggerType;

  constructor() {
    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(
          ({ level, timestamp, message }) =>
            `${[timestamp]} | ${level}: ${message}`
        )
      ),
      transports: [new winston.transports.Console()],
    });
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  error(message: string | Error) {
    this.logger.error(message);
  }

  info(message: string) {
    this.logger.info(message);
  }
}
