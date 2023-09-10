import { Router } from "express"

const webRouter = Router()

// [ ] CRIAR MIDDLEWARE DE AUTENTICAÇÃO, CASO O USUÁRIO NÃO ESTEJA AUTENTICADO, REDIRECIONAR PARA AUTH
//     [ ] CASO O USUÁRIO NÃO POSSUA LOGIN, PERGUNTAR SE ELE É UM CLIENTE QUE DESEJA APENAS ACOMPANHAR O PEDIDO

webRouter.get('/', (req, res) => {
  // [ ] VERIFICAR SE JÁ EXISTE UM FILA INICIADA
  //     [ ] SE SIM, REDIRECIONAR PARA GERENCIAR FILA
  //     [ ] SE NÃO, SEGUIR COM A ROTA DE INICIAÇÃO DE FILA
  res.render('index.ejs')
})
webRouter.get('/gerenciar-fila', (req, res) => res.render('manage-queue.ejs'))
webRouter.get('/fila', (req, res) => res.render('queue.ejs'))
webRouter.get('/acompanhando-pedido', (req, res) => res.render('follow.ejs', { order_id: undefined }))
webRouter.get('/acompanhando-pedido/:order_id', (req, res) => {
  res.render('follow.ejs', {
    order_id: req.params.order_id
  })
})

export default webRouter