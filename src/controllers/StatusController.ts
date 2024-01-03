import { controller, httpGet } from "inversify-express-utils"
import { Container, inject } from "inversify"
import * as express from "express"
import { ILogger } from "../logger/ILogger"
import { TYPES } from "../ioc/types"

export function statusControllerFactory(kernel: Container) {
    @controller("/api/status")
    class StatusController {
        constructor(
            @inject(TYPES.ILogger) private logger: ILogger
        ) {
        }
        @httpGet("/")
        async getStatus(req: express.Request): Promise<string> {
            return "Status is OK"
        }
    }
}

export default statusControllerFactory