import { DashboardController } from "../../../application/controllers/WebView/DashboardController";
import { DashboardUseCase } from "../../../domain/useCases/WebView/Dashboard/DashboardUseCase";
import { OrderItemRepository } from "../../repositories/in-prisma/OrderItemRepository";
import { OrderRepository } from "../../repositories/in-prisma/OrderRepository";
import { QueueRepository } from "../../repositories/in-prisma/QueueRepository";

export const DashboardFactory = () => {
  const orderRepo = new OrderRepository()
  const orderItemRepo = new OrderItemRepository()
  const queueRepo = new QueueRepository()

  const useCase = new DashboardUseCase(
    orderRepo,
    orderItemRepo,
    queueRepo
  );

  const controller = new DashboardController(useCase);

  return controller;
}