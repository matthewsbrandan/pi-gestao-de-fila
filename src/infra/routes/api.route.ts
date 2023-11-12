import { Router } from "express"
import { FindOrderByIdFactory } from "../factories/Order/FindOrderByIdFactory"

// --prefix: /api
const apiRouter = Router()

apiRouter.get('/order/:id', (req, res) => FindOrderByIdFactory().handle(req, res))

export default apiRouter