export default interface Notes extends INoteBody {
  userId: string
  _id: string
}

export interface INoteBody {
  title: string
  note: string
}
