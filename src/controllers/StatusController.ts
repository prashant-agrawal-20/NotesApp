import { controller, httpGet } from "inversify-express-utils"
import { Container, inject } from "inversify"
import * as express from "express"
import { ILogger, TYPES as LOGGER_TYPES } from "@openscriptsin/node-logger"

export function statusControllerFactory(kernel: Container) {
  @controller("/api/status")
  class StatusController {
    constructor(@inject(LOGGER_TYPES.ILogger) private logger: ILogger) {}
    @httpGet("/")
    async getStatus(req: express.Request): Promise<string> {
      this.logger.info("Status is OK")
      return "Status is OK"
    }
  }
  return StatusController
}

export default statusControllerFactory
