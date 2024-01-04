import * as express from "express"
export interface ILoginResponse {
  success: boolean
  userId?: string
  token?: string
}

export interface ISignUpResponse {
  success: boolean
}

export interface ISignUpRequest extends ILoginRequest {
  phoneNumber: string
  address?: string
}

export interface ILoginRequest {
  userId: string // userId can be an emailId which is always unique
  password: string // while saving password it should be encrypted
}

interface IAuthBusiness {
  registerUser(signUpRequest: ISignUpRequest): Promise<ISignUpResponse>
  verifyUserLogin(
    loginRequest: ILoginRequest,
    res: express.Response,
  ): Promise<ILoginResponse>
}
export default IAuthBusiness
