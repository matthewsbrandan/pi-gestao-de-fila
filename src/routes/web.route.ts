import { Router } from "express"

const webRouter = Router()

webRouter.get('/', (req, res) => res.render('index.ejs'))
webRouter.get('/gerenciar-fila', (req, res) => res.render('manage-queue.ejs'))
webRouter.get('/fila', (req, res) => res.render('queue.ejs'))
webRouter.get('/acompanhando-pedido', (req, res) => res.render('follow.ejs', { order_id: undefined }))
webRouter.get('/acompanhando-pedido/:order_id', (req, res) => {
  res.render('follow.ejs', {
    order_id: req.params.order_id
  })
})

export default webRouter