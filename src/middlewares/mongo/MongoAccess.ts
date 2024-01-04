import * as express from "express"
import mongoose from "mongoose"
import kernel from "../../ioc/kernel"
import { TYPES } from "../../ioc/types"
import { ILogger } from "../../logger/ILogger"
const logger = kernel.get<ILogger>(TYPES.ILogger)
const DATABASE_NAME: string = "speer-assignment"
const MONGO_URL: string = `mongodb://localhost:27017/${DATABASE_NAME}`
// This is mongodb local connection
export const connectMongo = (): Promise<typeof mongoose> => {
  logger.info("Trying to connect to mongo...")
  return mongoose.connect(MONGO_URL, {
    retryWrites: true,
    w: "majority",
  })
}
