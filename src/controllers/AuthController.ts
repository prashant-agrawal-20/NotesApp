import * as express from "express"
import { Container, inject } from "inversify"
import { controller, httpPost } from "inversify-express-utils"
import { ILoginResponse } from "../auth/IAuthBusiness"

export function authControllerFactory(kernel: Container) {
  @controller("/api/auth")
  class AuthController {
    constructor() {}
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
      return this.authBusiness.verifyUserLogin(req.body)
    }
  }
  return AuthController
}
export default authControllerFactory
