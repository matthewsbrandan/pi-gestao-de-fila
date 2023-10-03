import { CreateOrderController } from "../../../application/controllers/Order/CreateOrderController";
import { CreateOrderUseCase } from "../../../domain/useCases/Order/CreateOrder/CreateOrderUseCase";
import { OrderRepository } from "../../repositories/in-prisma/OrderRepository"

export const CreateOrderFactory = () => {
  const orderRepo = new OrderRepository();

  const useCase = new CreateOrderUseCase(
    orderRepo
  );

  const controller = new CreateOrderController(useCase);

  return { controller, useCase };
}