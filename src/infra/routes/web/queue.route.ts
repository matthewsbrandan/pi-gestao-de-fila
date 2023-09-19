import express from 'express';
import { StartQueueFactory } from '../../factories/Queue/StartQueueFactory';
import { middlewareAuth } from '../middleware/auth';
import { QueueManageFactory } from '../../factories/WebView/QueueManageFactory';
import { route } from '../routenames';

// --prefix /fila
const queueRouter = express.Router();

queueRouter.get(route.queue.home(), (req, res) => {
  req.flash('message', 'error: Esta funcionalidade ainda não está liberada');
  res.redirect('/');
  // res.render('queue.ejs')
})
// middlewareAuth,
queueRouter.post(route.queue.start(), (req, res) => StartQueueFactory().controller.handle(req,res))
// middlewareAuth,
queueRouter.get(route.queue.manage(), (req, res) => QueueManageFactory().handle(req, res))
queueRouter.get(route.queue.follow(), (req, res) => res.render('follow.ejs', { order_id: undefined }))
queueRouter.get(route.queue.following(':order_id'), (req, res) => {
  res.render('follow.ejs', {
    order_id: req.params.order_id
  })
})

export default queueRouter;
