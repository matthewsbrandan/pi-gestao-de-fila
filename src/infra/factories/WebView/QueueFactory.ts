import { QueueController } from "../../../application/controllers/WebView/QueueController";
import { FindStartedQueueFactory } from "../Queue/FindStartedQueueFactory";

export const QueueFactory = () => {  
  const findStartedQueue = FindStartedQueueFactory().useCase
  const controller = new QueueController(findStartedQueue);

  return controller;
}