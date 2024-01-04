import mongoose from "mongoose"
import Notes from "./Notes"
import NotesSchema from "./NotesSchema"
export default mongoose.model<Notes>("Notes", NotesSchema)
