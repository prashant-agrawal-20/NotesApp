import UserModel from "../../models/UserModel"
import IAuthBusiness, {
  ILoginRequest,
  ILoginResponse,
  ISignUpRequest,
  ISignUpResponse,
} from "./IAuthBusiness"
import { injectable } from "inversify"

@injectable()
class AuthBusiness implements IAuthBusiness {
  constructor() {}
  async registerUser(signUpRequest: ISignUpRequest): Promise<ISignUpResponse> {
    await UserModel.create({
      userId: signUpRequest.emailId,
      password: signUpRequest.password,
      phoneNumber: signUpRequest.phoneNumber,
    })
    return { success: true }
  }
  async verifyUserLogin(loginRequest: ILoginRequest): Promise<ILoginResponse> {
    return {
      emailId: "",
      phoneNumber: "",
      address: "",
    }
  }
}
export default AuthBusiness
