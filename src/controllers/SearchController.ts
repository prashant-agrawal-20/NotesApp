import { inject, Container } from "inversify"
import { controller, httpGet } from "inversify-express-utils"
import { ILogger, TYPES as LOGGER_TYPES } from "@openscriptsin/node-logger"
import { TYPES } from "../ioc/types"
import * as express from "express"
import NotesModel from "../models/notes/NotesModel"
import { IAuthMiddleware } from "../middlewares/auth/IAuthMiddleware"

export function searchControllerFactory(kernel: Container) {
  @controller(
    "/api/search",
    kernel.get<IAuthMiddleware>(TYPES.AuthMiddleware).authenticate,
  )
  class SearchController {
    constructor(@inject(LOGGER_TYPES.ILogger) private logger: ILogger) {}
    @httpGet("/")
    async searchNotes(req: express.Request, res: express.Response) {
      const queryText: string = req.query.q as string
      return NotesModel.find(
        { $text: { $search: queryText } },
        { score: { $meta: "textScore" } },
      ).sort({ score: { $meta: "textScore" } })
    }
  }
  return SearchController
}
