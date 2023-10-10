import { Router } from "express"
import authRouter from "./auth.route"
import { HomeFactory } from "../../factories/WebView/HomeFactory"
import queueRouter from "./queue.route"
import { route } from "../routenames"

const webRouter = Router()

webRouter.use('/auth', authRouter)

webRouter.get(route.home(), (req, res) => HomeFactory().handle(req,res))
// --prefix /fila
webRouter.use('/', queueRouter)

export default webRouter