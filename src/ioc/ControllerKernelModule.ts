import * as Inversify from "inversify"
import authControllerFactory from "../controllers/AuthController"
import statusControllerFactory from "../controllers/StatusController"

function controllerBindingFactory(kernel: Inversify.Container) {
  return new Inversify.ContainerModule((bind: Inversify.interfaces.Bind) => {
    statusControllerFactory(kernel)
    authControllerFactory(kernel)
  })
}
export default controllerBindingFactory
