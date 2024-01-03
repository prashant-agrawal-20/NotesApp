import path from "path"
import fs from "fs"
import { inject, injectable } from "inversify"
import { TYPES } from "../ioc/types"
import * as _ from "lodash"

@injectable()
export class Configuration {
  constructor(
    @inject(TYPES.ConfigurationDirectory) private appConfDir: string,
  ) {}

  public getConfiguration(): any {
    let confFileName
    const environment = process.env.ENVIRONMENT || "LOCAL"
    const appEntryDir = path.dirname(_.get(require.main, "filename", "src")) // returns dir of starting *.js file

    const confDir = path.join(appEntryDir, this.appConfDir)
    if (!fs.existsSync(confDir)) {
      throw new Error("Directory '" + this.appConfDir + "' doesn't exist.")
    }
    confFileName = path.join(confDir, environment + ".json")

    if (!fs.existsSync(confFileName)) {
      throw new Error(`Config file: '${confFileName}' doesn't exist.`)
    }
    console.log("Config file name: ", confFileName)
    const contents = fs.readFileSync(confFileName).toString()
    const conf = JSON.parse(contents)
    console.log("Success reading Config file")
    return conf
  }
}
