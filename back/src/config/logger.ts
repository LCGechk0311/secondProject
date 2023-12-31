import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";
import morgan from "morgan";
import path from "path";
import { Request, Response, NextFunction } from "express";
import { IError } from "error";

const logDir = "logs";
const infoLogDir = path.join(logDir, "info"); // info 로그를 저장할 폴더 경로
const errorLogDir = path.join(logDir, "error"); // error 로그를 저장할 폴더 경로

const { combine, timestamp, printf } = winston.format;

const logFormat = printf((info) => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

/**
 * Log Level
 * error:0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */

const logger = winston.createLogger({
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    logFormat
  ),
  transports: [
    new winstonDaily({
      level: "info",
      filename: path.join(infoLogDir, "%DATE%.info.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxFiles: "30d",
    }),
    new winstonDaily({
      level: "error",
      filename: path.join(errorLogDir, "%DATE%.error.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxFiles: "30d",
    }),
  ],
});

function httpLogger(req: Request, res: Response, next: NextFunction): void {
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :body",
    {
      stream: {
        write: (message: string) => {
          logger.info(message);
        },
      },
    }
  )(req, res, next);
}

morgan.token("body", (req: Request) => {
  return JSON.stringify(req.body);
});

function errorMiddleware(
  error: IError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (error.statusCode === null || error.statusCode === undefined)
    error.statusCode = 500;

  logger.error(
    `statusCode: ${error.statusCode} | Error Message: ${error.message} `
  );

  res.status(error.statusCode).send(error.message);
}

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export { httpLogger, errorMiddleware };
