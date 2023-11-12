import { FindOrderByDeviceIdController } from "../../../application/controllers/Order/FindOrderByDeviceIdController";
import { FindOrderByDeviceIdUseCase } from "../../../domain/useCases/Order/FindOrderByDeviceId/FindOrderByDeviceIdUseCase";
import { OrderRepository } from "../../repositories/in-prisma/OrderRepository"
import { QueueRepository } from "../../repositories/in-prisma/QueueRepository";

export const FindOrderByDeviceIdFactory = () => {
  const queueRepo = new QueueRepository();
  const orderRepo = new OrderRepository();

  const useCase = new FindOrderByDeviceIdUseCase(
    queueRepo,
    orderRepo
  );

  const controller = new FindOrderByDeviceIdController(useCase);

  return controller;
}