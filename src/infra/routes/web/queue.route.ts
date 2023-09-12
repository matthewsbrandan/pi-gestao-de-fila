import express from 'express';

// --prefix: /fila
const queueRouter = express.Router();

queueRouter.get('/', (req, res) => res.render('queue.ejs'))
queueRouter.get('/gerenciar', (req, res) => res.render('manage-queue.ejs'))
queueRouter.get('/acompanhando-pedido', (req, res) => res.render('follow.ejs', { order_id: undefined }))
queueRouter.get('/acompanhando-pedido/:order_id', (req, res) => {
  res.render('follow.ejs', {
    order_id: req.params.order_id
  })
})

export default queueRouter;
