import IAuthBusiness, { ILoginRequest, ILoginResponse, ISignUpRequest, ISignUpResponse } from "./IAuthBusiness"
import { injectable } from "inversify"

@injectable()
class AuthBusiness implements IAuthBusiness {
    constructor(

    ) {
    }
    async registerUser(signUpRequest: ISignUpRequest): Promise<ISignUpResponse> {
        return {success: true}
    }
    async verifyUserLogin(loginRequest: ILoginRequest): Promise<ILoginResponse> {

        return {
            emailId: "",
            phoneNumber: "",
            address: ""
        }

    }
}
export default AuthBusiness