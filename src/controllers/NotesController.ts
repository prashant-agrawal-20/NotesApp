import { Container, inject } from "inversify"
import { controller, httpGet } from "inversify-express-utils"
import { ILogger } from "../logger/ILogger"
import { IAuthMiddleware } from "../middlewares/auth/IAuthMiddleware"
import { TYPES } from "../ioc/types"
import * as express from "express"

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
      // to fetch all the notes belonging to user
    }
  }
  return NotesController
}
