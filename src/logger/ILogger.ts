export interface ILogger {
    info(msg: string, ...meta: any[]): void
    warn(msg: string, ...meta: any[]): void
    debug(msg: string, ...meta: any[]): void
    error(msg: string, ...meta: any[]): void
}
export const LogLevels = ["INFO", "WARN", "DEBUG", "ERROR"]
export enum LogLevel {
    ERROR= 0,
    WARN= 1,
    INFO= 2,
    DEBUG= 3
}

export interface LoggingOptions {
    logDir?: string
    logToFile?: boolean
    logToConsole?: boolean
}