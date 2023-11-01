import { FindOrderByIdController } from "../../../application/controllers/Order/FindOrderByIdController";
import { FindOrderByIdUseCase } from "../../../domain/useCases/Order/FindOrderById/FindOrderByIdUseCase";
import { OrderRepository } from "../../repositories/in-prisma/OrderRepository";

export const FindOrderByIdFactory = () => {
  const orderRepo = new OrderRepository()

  const useCase = new FindOrderByIdUseCase(orderRepo);

  const controller = new FindOrderByIdController(useCase);

  return controller;
}