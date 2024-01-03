export interface ILoginResponse {
  emailId: string
  phoneNumber: string
  address?: string
}

export interface ISignUpResponse {
  success: boolean
}

export interface ISignUpRequest extends ILoginRequest {
  phoneNumber: string
  address?: string
}

export interface ILoginRequest {
  emailId: string
  password: string
}

interface IAuthBusiness {
  registerUser(signUpRequest: ISignUpRequest): Promise<ISignUpResponse>
  verifyUserLogin(loginRequest: ILoginRequest): Promise<ILoginResponse>
}
export default IAuthBusiness
