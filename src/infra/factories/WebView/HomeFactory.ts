import { HomeController } from "../../../application/controllers/WebView/HomeController";
import { OrderRepository } from "../../repositories/in-prisma/OrderRepository";
import { FindStartedQueueFactory } from "../Queue/FindStartedQueueFactory";
import { DashboardFactory } from "./DashboardFactory";

export const HomeFactory = () => {  
  const findStartedQueue = FindStartedQueueFactory().useCase
  const orderRepo = new OrderRepository();

  const dashUseCase = DashboardFactory().useCase

  const controller = new HomeController(findStartedQueue, orderRepo, dashUseCase);

  return controller;
}