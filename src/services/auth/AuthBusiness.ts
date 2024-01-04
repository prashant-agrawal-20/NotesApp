import UserModel from "../../models/UserModel"
import IAuthBusiness, {
  ILoginRequest,
  ILoginResponse,
  ISignUpRequest,
  ISignUpResponse,
} from "./IAuthBusiness"
import { injectable, inject } from "inversify"
import User from "../../models/User"
import { TYPES } from "../../ioc/types"
import { ILogger } from "../../logger/ILogger"
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
import * as express from "express"
import { Configuration } from "../../conf/Configuration"
import * as _ from "lodash"

@injectable()
class AuthBusiness implements IAuthBusiness {
  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.Configuration) private configuration: Configuration,
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
        token = this.generateJWTToken(userId, password, user.password)
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

  private generateJWTToken(
    userId: string
  ): string {
    const secretKey: string = _.get(
      this.configuration.getConfiguration(),
      "serverConfig.secretKey",
      "",
    )
    const tokenExpiry: string = _.get(
      this.configuration.getConfiguration(),
      "serverConfig.tokenExpiry",
      "12h",
    )
    return jwt.sign({ userId: userId }, secretKey, {
      expiresIn: tokenExpiry,
    })
  }
}
export default AuthBusiness
