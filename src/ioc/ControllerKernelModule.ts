import * as Inversify from "inversify"
import authControllerFactory from "../controllers/AuthController"
import statusControllerFactory from "../controllers/StatusController"
import { notesControllerFactory } from "../controllers/NotesController"
import { searchControllerFactory } from "../controllers/SearchController"

function controllerBindingFactory(kernel: Inversify.Container) {
  return new Inversify.ContainerModule((bind: Inversify.interfaces.Bind) => {
    statusControllerFactory(kernel)
    authControllerFactory(kernel)
    notesControllerFactory(kernel)
    searchControllerFactory(kernel)
  })
}
export default controllerBindingFactory
