import * as Inversify from "inversify"
import authControllerFactory from "../controllers/AuthController"
import statusControllerFactory from "../controllers/StatusController"
import { notesControllerFactory } from "../controllers/NotesController"

function controllerBindingFactory(kernel: Inversify.Container) {
  return new Inversify.ContainerModule((bind: Inversify.interfaces.Bind) => {
    statusControllerFactory(kernel)
    authControllerFactory(kernel)
    notesControllerFactory(kernel)
  })
}
export default controllerBindingFactory
