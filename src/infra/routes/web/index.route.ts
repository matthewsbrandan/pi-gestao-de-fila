import { Router } from "express"
import authRouter from "./auth.route"
import { HomeFactory } from "../../factories/WebView/HomeFactory"

const webRouter = Router()

webRouter.use('/auth', authRouter)

// [x] CRIAR MIDDLEWARE DE AUTENTICAÇÃO, CASO O USUÁRIO NÃO ESTEJA AUTENTICADO, REDIRECIONAR PARA AUTH
//     [ ] CASO O USUÁRIO NÃO POSSUA LOGIN, PERGUNTAR SE ELE É UM CLIENTE QUE DESEJA APENAS ACOMPANHAR O PEDIDO

webRouter.get('/', (req, res) => HomeFactory().handle(req,res))

export default webRouter