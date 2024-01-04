import { Schema } from "mongoose"

const UserSchema: Schema = new Schema({
  userId: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, required: false },
  phoneNumber: { type: String, required: false },
})

export default UserSchema
