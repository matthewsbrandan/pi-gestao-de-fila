import { UpdateOrderController } from "../../../application/controllers/Order/UpdateOrderController";
import { UpdateOrderUseCase } from "../../../domain/useCases/Order/UpdateOrder/UpdateOrderUseCase";
import { OrderRepository } from "../../repositories/in-prisma/OrderRepository"

export const UpdateOrderFactory = () => {
  const orderRepo = new OrderRepository();

  const useCase = new UpdateOrderUseCase(
    orderRepo
  );

  const controller = new UpdateOrderController(useCase);

  return { controller, useCase };
}