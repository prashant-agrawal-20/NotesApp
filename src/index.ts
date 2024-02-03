import "reflect-metadata"
import { APIServer as Server } from "./server"
import kernel from "./ioc/kernel"
import * as express from "express"
import bodyParser from "body-parser"
import rateLimit from "express-rate-limit"
import { Configuration } from "./conf/Configuration"
import { TYPES } from "./ioc/types"
import * as _ from "lodash"
import { ILogger, TYPES as LoggerTypes } from "@openscriptsin/node-logger"
import { connectMongo } from "./middlewares/mongo/MongoAccess"

const logger: ILogger = kernel.get<ILogger>(LoggerTypes.ILogger)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
const server = new Server(kernel)
server.setConfig((app: express.Application) => {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(limiter)
})
const app = server.build()
const appConfigs =
  kernel.get<Configuration>(TYPES.Configuration).getConfiguration() || {}
connectMongo()
  .then((data) => {
    logger.info("Connected to mongo successfully....")
    const port = _.get(appConfigs, "serverConfig.port", 3000)
    const httpServer = app.listen(port, () => {
      console.log("MotesApp backend server is running on:" + port)
    })
    httpServer.on("connection", function (socket) {
      socket.setKeepAlive(true, 5)
      socket.setTimeout(120 * 1000)
      socket.on("timeout", () => {
        logger.error("socket timeout")
        socket.end()
      })
    })
    httpServer.keepAliveTimeout = 120 * 1000
    httpServer.headersTimeout = 120 * 1000
  })
  .catch((err) => {
    logger.error("Error while connecting to mongo...", { error: err })
    throw err
  })
