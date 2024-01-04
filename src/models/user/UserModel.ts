import mongoose from "mongoose"
import User from "./User"
import UserSchema from "./UserSchema"

export default mongoose.model<User>("User", UserSchema)
