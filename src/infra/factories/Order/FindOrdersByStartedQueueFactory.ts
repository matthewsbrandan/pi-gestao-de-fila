import { FindOrdersByStartedQueueController } from "../../../application/controllers/Order/FindOrdersByStartedQueueController";
import { FindOrdersByStartedQueueUseCase } from "../../../domain/useCases/Order/FindOrdersByStartedQueue/FindOrdersByStartedQueueUseCase";
import { OrderRepository } from "../../repositories/in-prisma/OrderRepository";
import { FindStartedQueueFactory } from "../Queue/FindStartedQueueFactory";

export const FindOrdersByStartedQueueFactory = () => {
  const orderRepo = new OrderRepository();

  const useCase = new FindOrdersByStartedQueueUseCase(
    orderRepo,
    FindStartedQueueFactory().useCase
  );

  const controller = new FindOrdersByStartedQueueController(useCase);

  return { controller, useCase };
}