import UserModel from "../../models/user/UserModel"
import IAuthBusiness, {
  ILoginRequest,
  ILoginResponse,
  ISignUpRequest,
  ISignUpResponse,
} from "./IAuthBusiness"
import { injectable, inject } from "inversify"
import User from "../../models/user/User"
import { TYPES } from "../../ioc/types"
import { ILogger, TYPES as LOGGER_TYPES } from "@openscriptsin/node-logger"
const bcrypt = require("bcrypt")
import * as express from "express"
import { Configuration } from "../../conf/Configuration"
import * as _ from "lodash"
import { IAuthUtil } from "../../util/IAuthUtil"

@injectable()
class AuthBusiness implements IAuthBusiness {
  constructor(
    @inject(LOGGER_TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.Configuration) private configuration: Configuration,
    @inject(TYPES.AuthUtil) private authUtil: IAuthUtil,
  ) {}

  async registerUser(signUpRequest: ISignUpRequest): Promise<ISignUpResponse> {
    const { userId, password, phoneNumber, address }: ISignUpRequest =
      signUpRequest
    const user: User = await UserModel.findOne({ userId })
    if (user && user.userId === userId) {
      this.logger.error(`User: ${userId} already exists`)
      throw new Error("User already exists")
    }
    const hashedPassword: string = await bcrypt.hash(password, 10)
    const savedEntry: User = await UserModel.create({
      userId,
      password: hashedPassword,
      phoneNumber,
    })
    if (savedEntry.userId === userId) {
      return { success: true }
    } else {
      return { success: false }
    }
  }

  async verifyUserLogin(
    loginRequest: ILoginRequest,
    res: express.Response,
  ): Promise<ILoginResponse> {
    const { userId, password }: ILoginRequest = loginRequest
    let token: string
    let success: boolean = false
    const user: User = await UserModel.findOne({ userId })
    if (user && user.userId === userId) {
      const passwordMatched = await bcrypt.compare(password, user.password)
      if (passwordMatched) {
        this.logger.info(
          `User ${userId} password matched!, generating jwt token`,
        )
        success = true
        token = this.authUtil.generateJWTToken(userId)
      } else {
        this.logger.error(`User ${userId} authentication failed`)
        res.status(401).json({ error: "Authentication failed!!" })
      }
    } else {
      this.logger.error(`User ${userId} not found`)
      res.status(401).json({ error: "User Not Found!!" })
    }
    return { token, success, userId }
  }

  // --------------------------------------------- Private methods ---------------------------------------------------
}
export default AuthBusiness
