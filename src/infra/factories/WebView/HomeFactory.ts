import { HomeController } from "../../../application/controllers/WebView/HomeController";
import { QueueRepository } from "../../repositories/in-prisma/QueueRepository"
import { FindStartedQueueFactory } from "../Queue/FindStartedQueueFactory";

export const HomeFactory = () => {  
  const findStartedQueue = FindStartedQueueFactory().useCase
  const controller = new HomeController(findStartedQueue);

  return controller;
}