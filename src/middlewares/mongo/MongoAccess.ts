import * as express from "express"
import mongoose from "mongoose"
import kernel from "../../ioc/kernel"
import { TYPES } from "../../ioc/types"
import { ILogger } from "../../logger/ILogger"
const logger = kernel.get<ILogger>(TYPES.ILogger)
const MONGO_DB_USER: string = "notesApp"
const DATABASE_NAME: string = "speer-assignment"
const MONGO_DB_PASSWORD: string = "nvUvVveoTxBwC19y"
const MONGO_URL: string = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@notesapp.ztpx4as.mongodb.net/${DATABASE_NAME}`
export const connectMongo = (): Promise<typeof mongoose> => {
  logger.info("Trying to connect to mongo...")
  return mongoose.connect(MONGO_URL, {
    retryWrites: true,
    w: "majority",
  })
}
