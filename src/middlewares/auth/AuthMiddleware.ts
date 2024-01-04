import { inject, injectable } from "inversify"
import { IAuthMiddleware } from "./IAuthMiddleware"
import { TYPES } from "../../ioc/types"
import { ILogger } from "../../logger/ILogger"
import * as express from "express"
import { IAuthUtil } from "../../util/IAuthUtil"

@injectable()
class AuthMiddleware implements IAuthMiddleware {
  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.AuthUtil) private authUtil: IAuthUtil,
  ) {
    this.authenticate = this.authenticate.bind(this)
  }

  public authenticate(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): void {
    this.logger.info("Authenticating jwt token")
    return this.authUtil.decodeJWTToken(req, res, next)
  }
}

export default AuthMiddleware
