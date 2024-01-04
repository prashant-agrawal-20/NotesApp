export default interface Notes extends INoteBody {
  userId: string
  sharedWith: string[]
  _id: string
}

export interface INoteBody {
  title: string
  note: string
}
