import { Container, inject } from "inversify"
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
} from "inversify-express-utils"
import { ILogger } from "../logger/ILogger"
import { IAuthMiddleware } from "../middlewares/auth/IAuthMiddleware"
import { TYPES } from "../ioc/types"
import * as express from "express"
import { INoteBody } from "../models/notes/Notes"
import NotesModel from "../models/notes/NotesModel"
import * as _ from "lodash"

export function notesControllerFactory(kernel: Container) {
  @controller(
    "/api/notes",
    kernel.get<IAuthMiddleware>(TYPES.AuthMiddleware).authenticate,
  )
  class NotesController {
    constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

    @httpGet("/")
    getNotes(req: express.Request, res: express.Response) {
      this.logger.info(
        `Fetching notes for the user ${req["headers"]["userId"] as string}`,
      )
      const userId: string = req["headers"]["userId"] as string
      return NotesModel.find({ $or: [{ userId, sharedWith: userId }] })
      // to fetch all the notes belonging to user
    }

    @httpGet("/:id")
    getNotesById(req: express.Request, res: express.Response) {
      const id: string = req.params.id as string
      this.logger.info(
        `Fetching notes for the user ${
          req["headers"]["userId"] as string
        } for id: ${id}`,
      )
      const userId: string = req["headers"]["userId"] as string
      return NotesModel.findOne({
        _id: id,
        $or: [{ userId, sharedWith: userId }],
      })
      // to fetch all the notes belonging to user
    }

    @httpPost("/")
    createNotes(req: express.Request, res: express.Response) {
      const userId: string = req["headers"]["userId"] as string
      const { title, note } = { ...req.body } as INoteBody
      this.logger.info(`Creating new notes for userId ${userId}`, {
        title,
        note,
      })
      return NotesModel.create({
        userId,
        title,
        note,
      })
    }

    @httpPost("/:id/share")
    async shareNotes(req: express.Request, res: express.Response) {
      const id: string = req.params.id as string
      const userId: string = req["headers"]["userId"] as string
      const shareWith: string = req.body.shareWith as string
      this.logger.info(
        `Fetching notes of the user ${
          req["headers"]["userId"] as string
        } for id: ${id} and pushing user ${shareWith} in sharedWith`,
      )
      const existingNote = await NotesModel.findOne({ _id: id, userId })
      const updatedSharedWith: string[] = _.uniq([
        ..._.get(existingNote, "sharedWith", []),
        shareWith,
      ])
      const newNotes = Object.assign(existingNote, {
        sharedWith: updatedSharedWith
      })
      this.logger.info(`Updating notes for noteId: ${id} and userId: ${userId}`)
      await NotesModel.findOneAndUpdate({ _id: id, userId }, newNotes, {
        new: true,
      })
    }

    @httpPut("/:id")
    async updateNotes(req: express.Request, res: express.Response) {
      const id: string = req.params.id as string
      const userId: string = req["headers"]["userId"] as string
      const { title, note } = { ...req.body } as INoteBody
      if (_.isEmpty(note) || _.isEmpty(title)) {
        res.status(400).json({ error: "title or note cannot be empty" })
        return
      }
      const existingNote = await NotesModel.findOne({ _id: id, userId })
      const newNotes = Object.assign(existingNote, { title, note })
      this.logger.info(`Updating notes for noteId: ${id} and userId: ${userId}`)
      await NotesModel.findOneAndUpdate({ _id: id, userId: userId }, newNotes, {
        new: true,
      })
      this.logger.info("Updated Notes successfully..", { noteId: id })
    }

    @httpDelete("/:id")
    async deleteNotes(req: express.Request, res: express.Response) {
      const id: string = req.params.id as string
      const userId: string = req["headers"]["userId"] as string
      const updateResp = await NotesModel.deleteOne({ userId, _id: id })
      if (!updateResp || updateResp.deletedCount !== 1) {
        this.logger.error(
          `Error while deleting note: ${id} for userId: ${userId}`,
        )
        res.status(500).json({ error: "Could not delete the notes" })
        return
      }
      this.logger.info(
        `NoteId: ${id} deleted successfully for userId: ${userId}`,
      )
      return updateResp
    }
  }
  return NotesController
}
