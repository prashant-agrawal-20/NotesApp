import { inject, injectable } from "inversify"
import { ILogger, TYPES as LOGGER_TYPES } from "@openscriptsin/node-logger"
import { TYPES } from "../ioc/types"
import { Configuration } from "../conf/Configuration"
import * as _ from "lodash"
import { IAuthUtil } from "./IAuthUtil"
import * as jwt from "jsonwebtoken"
import * as express from "express"

@injectable()
export class AuthUtil implements IAuthUtil {
  constructor(
    @inject(LOGGER_TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.Configuration) private configuration: Configuration,
  ) {}

  public getJWTSecretKey(): string {
    return _.get(
      this.configuration.getConfiguration(),
      "serverConfig.secretKey",
      "",
    )
  }

  public getJWTTokenExpiry(): string {
    return _.get(
      this.configuration.getConfiguration(),
      "serverConfig.tokenExpiry",
      "12h",
    )
  }

  public generateJWTToken(userId: string): string {
    const secretKey: string = this.getJWTSecretKey()
    const tokenExpiry: string = this.getJWTTokenExpiry()
    return jwt.sign({ userId: userId }, secretKey, {
      expiresIn: tokenExpiry,
    })
  }

  public decodeJWTToken(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): void {
    try {
      const token: string = req.header("Authorization") as string
      if (!token) {
        res
          .status(401)
          .json({ error: "Access Denied!! Authorization token not present" })
        this.logger.info("Token not found")
        throw new jwt.JsonWebTokenError(
          "Authorization token not present in request",
        )
      }
      const secretKey = this.getJWTSecretKey()
      const decoded: any = jwt.verify(token, secretKey)
      req["headers"]["userId"] = decoded.userId
      next()
    } catch (err) {
      this.logger.info("Invalid token..", { err })
      res.status(401).json({ error: "Invalid token" })
      throw new jwt.JsonWebTokenError("Invalid Token...")
    }
  }
}
