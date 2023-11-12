import express from 'express';
import { StartQueueFactory } from '../../factories/Queue/StartQueueFactory';
import { QueueManageFactory } from '../../factories/WebView/QueueManageFactory';
import { route } from '../routenames';
import { QueueFollowFactory } from '../../factories/WebView/QueueFollowFactory';
import { QueueFactory } from '../../factories/WebView/QueueFactory';
import { CloseQueueFactory } from '../../factories/Queue/CloseQueueFactory';

// --prefix /fila
const queueRouter = express.Router();

queueRouter.get(route.queue.home(), (req, res) => QueueFactory().handle(req, res))
queueRouter.post(route.queue.start(), (req, res) => StartQueueFactory().controller.handle(req,res))
queueRouter.get(route.queue.manage(), (req, res) => QueueManageFactory().handle(req, res))
queueRouter.get(route.queue.follow(), (req, res) => QueueFollowFactory().handle(req, res))
queueRouter.get(route.queue.following(':order_id'), (req, res) => QueueFollowFactory().handle(req, res))
queueRouter.get(route.queue.close(), (req, res) => CloseQueueFactory().handle(req, res))

export default queueRouter;
