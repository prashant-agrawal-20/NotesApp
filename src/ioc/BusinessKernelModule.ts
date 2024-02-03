import { Container, ContainerModule, interfaces } from "inversify"
import IAuthBusiness from "../services/auth/IAuthBusiness"
import { TYPES } from "./types"
import AuthBusiness from "../services/auth/AuthBusiness"
import {
  ILogger,
  ILogOptions,
  Logger,
  TYPES as LoggerTypes,
} from "@openscriptsin/node-logger"
import { Configuration } from "../conf/Configuration"
import { AuthUtil } from "../util/AuthUtil"
import { IAuthUtil } from "../util/IAuthUtil"
import { IAuthMiddleware } from "../middlewares/auth/IAuthMiddleware"
import AuthMiddleware from "../middlewares/auth/AuthMiddleware"

export function BusinessKernelModule(kernel: Container) {
  return new ContainerModule((bind: interfaces.Bind) => {
    bind<string>(TYPES.ConfigurationDirectory).toConstantValue("conf")
    bind<ILogOptions>(LoggerTypes.LogOptions).toDynamicValue(
      (context: interfaces.Context) => {
        const appConfig = context.container
          .get<any>(TYPES.Configuration)
          .getConfiguration()
        const defaults: ILogOptions = {
          logDir: appConfig.loggingDir || "logs",
          logToFile: true,
          logToConsole: false,
        }
        const options = Object.assign({}, defaults, appConfig.logging)
        if (options.logToFile && !options.logDir) {
          throw new Error(
            "Logging Directory not found!, Please mention loggingDir in the conf",
          )
        }
        return options
      },
    )
    bind<Configuration>(TYPES.Configuration)
      .to(Configuration)
      .inSingletonScope()
    bind<ILogger>(LoggerTypes.ILogger).to(Logger).inSingletonScope()
    bind<IAuthUtil>(TYPES.AuthUtil).to(AuthUtil).inSingletonScope()
    bind<IAuthMiddleware>(TYPES.AuthMiddleware)
      .to(AuthMiddleware)
      .inSingletonScope()
    bind<IAuthBusiness>(TYPES.AuthBusiness).to(AuthBusiness).inSingletonScope()
  })
}
export default BusinessKernelModule
