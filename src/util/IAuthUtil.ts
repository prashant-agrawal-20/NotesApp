import * as express from "express"
export interface IAuthUtil {
  getJWTSecretKey(): string
  getJWTTokenExpiry(): string
  generateJWTToken(userId: string): string
  decodeJWTToken(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): void
}
