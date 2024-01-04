import * as express from "express"
export interface IAuthMiddleware {
  authenticate(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): void
}
