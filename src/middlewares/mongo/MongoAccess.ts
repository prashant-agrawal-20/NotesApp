import mongoose from "mongoose"
import kernel from "../../ioc/kernel"
import { TYPES } from "../../ioc/types"
import { ILogger, TYPES as LOGGER_TYPES } from "@openscriptsin/node-logger"
import { Configuration } from "../../conf/Configuration"
import * as _ from "lodash"
const logger: ILogger = kernel.get<ILogger>(LOGGER_TYPES.ILogger)
const appConfig = kernel
  .get<Configuration>(TYPES.Configuration)
  .getConfiguration()
const databaseName: string = _.get(
  appConfig,
  "mongoConfig.database",
  "sample-assignment",
)
const mongoUrl: string = _.get(appConfig, "mongoConfig.mongoUrl", "") + "/"
const user: string = _.get(appConfig, "mongoConfig.user", "")
const password: string = _.get(appConfig, "mongoConfig.password", "")
const connectionString = mongoUrl + databaseName
export const connectMongo = (): Promise<typeof mongoose> => {
  logger.info("Trying to connect to mongo...")
  return mongoose.connect(connectionString, {
    user: user,
    pass: password,
    retryWrites: true,
    w: "majority",
  })
}
