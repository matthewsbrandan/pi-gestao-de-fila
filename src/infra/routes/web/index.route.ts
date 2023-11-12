import { Router } from "express"
import authRouter from "./auth.route"
import { HomeFactory } from "../../factories/WebView/HomeFactory"
import queueRouter from "./queue.route"
import { route } from "../routenames"
import productRouter from "./product.route"
import { DashboardFactory } from "../../factories/WebView/DashboardFactory"

const webRouter = Router()

webRouter.use('/auth', authRouter)

webRouter.get(route.home(), (req, res) => HomeFactory().handle(req,res))
// --prefix /fila
webRouter.use('/', queueRouter)
// --prefix /produtos
webRouter.use('/', productRouter)
webRouter.get('/dashboard', (req, res) => DashboardFactory().controller.handle(req, res))

export default webRouter