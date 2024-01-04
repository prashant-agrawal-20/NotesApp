import { ILogger, LoggingOptions, LogLevel, LogLevels } from "./ILogger"
import * as winston from "winston"
import { format, createLogger } from "winston"
import * as _ from "lodash"
import fs from "fs"
import { TYPES } from "../ioc/types"
import { inject, injectable } from "inversify"
import path from "path"
import DailyRotateFile from "winston-daily-rotate-file"
import util from "util"

type WinstonLoggingLevel = "error" | "warn" | "info" | "debug"
@injectable()
export class Logger implements ILogger {
  private infoLogger: winston.Logger
  private warnLogger: winston.Logger
  private debugLogger: winston.Logger
  private errorLogger: winston.Logger
  private logLevel: LogLevel

  private getWinstonTransportsConfig(
    winstonLoggingLevel: WinstonLoggingLevel,
  ): any {
    const transports = []
    const logToFile: boolean = !!(
      this.loggingOptions.logToFile && this.loggingOptions.logDir
    )
    if (logToFile) {
      transports.push(
        new DailyRotateFile({
          silent: false,
          filename: path.join(
            this.loggingOptions.logDir || "logs",
            winstonLoggingLevel + "-%DATE%.log",
          ),
          datePattern: "YYYY-MM-DD",
          maxFiles: 24 * 10,
          level: winstonLoggingLevel,
          handleExceptions: true,
          zippedArchive: true,
          json: true,
        }),
      )
    }
    if (this.loggingOptions.logToConsole || !logToFile) {
      transports.push(
        new winston.transports.Console({
          silent: false,
          level: winstonLoggingLevel,
          handleExceptions: true,
        }),
      )
    }
    return transports
  }

  constructor(
    @inject(TYPES.LoggingOptions) private loggingOptions: LoggingOptions,
  ) {
    if (
      !_.isNil(process.env.LOG_LEVEL) &&
      LogLevels.includes(process.env.LOG_LEVEL)
    ) {
      this.logLevel = process.env.LOG_LEVEL as unknown as LogLevel
    } else {
      this.logLevel = LogLevel.INFO
    }
    if (
      this.loggingOptions.logDir &&
      !fs.existsSync(this.loggingOptions.logDir)
    ) {
      const mkdirp = require("mkdirp")
      mkdirp.sync(this.loggingOptions.logDir)
    }
    function errorReplacer(key: string, value: any) {
      if (value instanceof Error) {
        return { message: value.message, stack: value.stack }
      }
      return value
    }

    const logFormat = format.printf((info) => {
      return `${JSON.stringify(info, errorReplacer)}`
    })

    this.infoLogger = createLogger({
      transports: this.getWinstonTransportsConfig("info"),
      exitOnError: false,
      format: format.combine(
        format.splat(),
        format.simple(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat,
      ),
    })

    this.warnLogger = createLogger({
      transports: this.getWinstonTransportsConfig("warn"),
      exitOnError: false,
      format: format.combine(
        format.splat(),
        format.simple(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat,
      ),
    })

    this.debugLogger = createLogger({
      transports: this.getWinstonTransportsConfig("debug"),
      exitOnError: false,
      format: format.combine(
        format.splat(),
        format.simple(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat,
      ),
    })

    this.errorLogger = createLogger({
      transports: this.getWinstonTransportsConfig("error"),
      exitOnError: false,
      format: format.combine(
        format.splat(),
        format.simple(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat,
      ),
    })
  }

  jsonifyMeta(msg: string, meta: any[]) {
    if (_.isEmpty(meta)) {
      return msg
    }
    return (
      msg +
      " meta: " +
      util.inspect(meta, { depth: 5, compact: true, breakLength: Infinity })
    )
  }

  async info(msg: string, ...meta: any[]) {
    if (this.shouldLogAtLevel(LogLevel.INFO)) {
      this.infoLogger.info(this.jsonifyMeta(msg, meta))
    }
  }

  async warn(msg: string, ...meta: any[]) {
    if (this.shouldLogAtLevel(LogLevel.WARN)) {
      this.warnLogger.info(this.jsonifyMeta(msg, meta))
    }
  }

  async debug(msg: string, ...meta: any[]) {
    if (this.shouldLogAtLevel(LogLevel.DEBUG)) {
      this.debugLogger.debug(this.jsonifyMeta(msg, meta))
    }
  }

  async error(msg: string, ...meta: any[]) {
    if (this.shouldLogAtLevel(LogLevel.ERROR)) {
      this.errorLogger.error(msg, ...meta)
    }
  }
  private shouldLogAtLevel(logLevel: LogLevel): boolean {
    return this.logLevel >= logLevel
  }
}
