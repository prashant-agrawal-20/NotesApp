import { Schema } from "mongoose"

const NotesSchema: Schema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true, default: "" },
  note: { type: String, required: true, default: "" },
}).index(
  { note: "text", title: "text" },
  { name: "Notes text index", weights: { note: 10, title: 5 } },
)

export default NotesSchema
