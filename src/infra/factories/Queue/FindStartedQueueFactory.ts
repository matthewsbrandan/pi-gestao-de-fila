import { FindStartedQueueController } from "../../../application/controllers/Queue/FindStartedQueueController";
import { FindStartedQueueUseCase } from "../../../domain/useCases/Queue/FindStartedQueue/FindStartedQueueUseCase";
import { QueueRepository } from "../../repositories/in-prisma/QueueRepository"

export const FindStartedQueueFactory = () => {
  const queueRepo = new QueueRepository();

  const useCase = new FindStartedQueueUseCase(
    queueRepo
  );

  const controller = new FindStartedQueueController(useCase);

  return { controller, useCase };
}