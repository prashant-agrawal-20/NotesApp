import { InversifyExpressServer, TYPE } from "inversify-express-utils"
import * as express from "express"
import { Container } from "inversify"
import util from "util"
import { ILogger } from "./logger/ILogger"
import { TYPES } from "./ioc/types"
export class APIServer extends InversifyExpressServer {
  private kernel1: Container
  private logger: ILogger
  constructor(kernel: Container) {
    super(kernel)
    this.kernel1 = kernel
    this.logger = kernel.get<ILogger>(TYPES.ILogger)
    const obj: any = this
    obj.handlerFactory = this.handlerFactoryFunc
  }

  private handlerFactoryFunc(
    controllerName: any,
    key: string,
  ): express.RequestHandler {
    const that = this
    return function ApiRequestHandler(
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) {
      let _value: any
      if (res.headersSent) {
        // NOTE: response already sent, need not execute further controllers
        return next()
      }
      Promise.resolve(that.execute(controllerName, key, req, res, next))
        .then((value: any) => {
          _value = value
          if (!res.headersSent) {
            res.send(value)
          }
          next()
        })
        .catch((error: any) => {
          that.logger.error(
            "Error sending api response: " +
              util.inspect(_value, false, 10, false),
          )
          next(error)
        })
    }
  }
  protected async execute(
    controllerName: any,
    key: string,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const named: any = this.kernel1.getNamed(TYPE.Controller, controllerName)
    return await named[key](req, res, next)
  }
}
