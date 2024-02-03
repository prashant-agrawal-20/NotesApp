import * as express from "express"
import { Container, inject } from "inversify"
import { controller, httpGet, httpPost } from "inversify-express-utils"
import IAuthBusiness, { ILoginResponse } from "../services/auth/IAuthBusiness"
import { TYPES } from "../ioc/types"
import { ILogger, TYPES as LOGGER_TYPES } from "@openscriptsin/node-logger"

export function authControllerFactory(kernel: Container) {
  @controller("/api/auth")
  class AuthController {
    constructor(
      @inject(TYPES.AuthBusiness) private authBusiness: IAuthBusiness,
      @inject(LOGGER_TYPES.ILogger) private logger: ILogger,
    ) {}
    @httpPost("/signup")
    async emailSignup(
      req: express.Request,
      res: express.Response,
    ): Promise<{ success: boolean }> {
      return this.authBusiness.registerUser(req.body)
    }

    @httpPost("/login")
    async verifyLogin(
      req: express.Request,
      res: express.Response,
    ): Promise<ILoginResponse> {
      return this.authBusiness.verifyUserLogin(req.body, res)
    }
  }
  return AuthController
}
export default authControllerFactory
