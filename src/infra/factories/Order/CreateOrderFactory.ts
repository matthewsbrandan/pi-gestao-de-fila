import { CreateOrderController } from "../../../application/controllers/Order/CreateOrderController";
import { CreateOrderUseCase } from "../../../domain/useCases/Order/CreateOrder/CreateOrderUseCase";
import { DeviceRepository } from "../../repositories/in-prisma/DeviceRepository";

import { OrderItemRepository } from "../../repositories/in-prisma/OrderItemRepository";
import { OrderRepository } from "../../repositories/in-prisma/OrderRepository"
import { QueueRepository } from "../../repositories/in-prisma/QueueRepository";
import { UserRepository } from "../../repositories/in-prisma/UserRepository";

export const CreateOrderFactory = () => {
  const orderRepo = new OrderRepository();
  const queueRepo = new QueueRepository();
  const deviceRepo = new DeviceRepository();
  const userRepo = new UserRepository();
  const orderItemRepo = new OrderItemRepository();

  const useCase = new CreateOrderUseCase(
    orderRepo, queueRepo, deviceRepo, userRepo, orderItemRepo,
  );

  const controller = new CreateOrderController(useCase);

  return { controller, useCase };
}