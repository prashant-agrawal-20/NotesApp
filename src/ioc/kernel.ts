import * as Inversify from "inversify"
import { Container } from "inversify"
import BusinessKernelModule from "./BusinessKernelModule"
import ControllerKernelModule from "./ControllerKernelModule"
export const kernel: Inversify.Container = new Container()

kernel.load(
    BusinessKernelModule(kernel),
    ControllerKernelModule(kernel)
)
export default kernel