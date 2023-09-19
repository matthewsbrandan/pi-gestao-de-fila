import { QueueManageController } from "../../../application/controllers/WebView/QueueManageController";
import { FindStartedQueueFactory } from "../Queue/FindStartedQueueFactory";

export const QueueManageFactory = () => {  
  const findStartedQueue = FindStartedQueueFactory().useCase
  const controller = new QueueManageController(findStartedQueue);

  return controller;
}