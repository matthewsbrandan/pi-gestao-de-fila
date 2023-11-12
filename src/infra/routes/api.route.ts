import { Router } from "express"
import { FindOrderByIdFactory } from "../factories/Order/FindOrderByIdFactory"
import { FindOrderByDeviceIdFactory } from "../factories/Order/FindOrderByDeviceIdFactory"

// --prefix: /api
const apiRouter = Router()

apiRouter.get('/order/device/:id', (req, res) => FindOrderByDeviceIdFactory().handle(req, res))
apiRouter.get('/order/:id', (req, res) => FindOrderByIdFactory().handle(req, res))

export default apiRouter