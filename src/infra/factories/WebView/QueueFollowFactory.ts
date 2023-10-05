import { QueueFollowController } from "../../../application/controllers/WebView/QueueFollowController";
import { OrderRepository } from "../../repositories/in-prisma/OrderRepository";
import { FindStartedQueueFactory } from "../Queue/FindStartedQueueFactory";

export const QueueFollowFactory = () => {  
  const findStartedQueue = FindStartedQueueFactory().useCase
  const orderRepo = new OrderRepository();
  const controller = new QueueFollowController(findStartedQueue, orderRepo);

  return controller;
}