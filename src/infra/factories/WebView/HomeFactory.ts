import { HomeController } from "../../../application/controllers/WebView/HomeController";
import { FindStartedQueueFactory } from "../Queue/FindStartedQueueFactory";

export const HomeFactory = () => {  
  const findStartedQueue = FindStartedQueueFactory().useCase
  const controller = new HomeController(findStartedQueue);

  return controller;
}