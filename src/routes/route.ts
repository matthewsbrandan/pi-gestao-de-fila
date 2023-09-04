import { Router } from "express"
import webRouter from "./web.route"
import apiRouter from "./api.route"

const router = Router()

router.use('/', webRouter)
router.use('/api/', apiRouter)

export default router