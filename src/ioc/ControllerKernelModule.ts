import * as Inversify from "inversify"
import authControllerFactory from "../controllers/AuthController"

function controllerBindingFactory(kernel: Inversify.Container) {
    return new Inversify.ContainerModule((bind: Inversify.interfaces.Bind) => {
        authControllerFactory(kernel)
    })
}
export default controllerBindingFactory