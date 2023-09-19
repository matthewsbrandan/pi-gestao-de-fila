import { StartQueueController } from "../../../application/controllers/Queue/StartQueueController";
import { StartQueueUseCase } from "../../../domain/useCases/Queue/StartQueue/StartQueueUseCase";
import { QueueRepository } from "../../repositories/in-prisma/QueueRepository"

export const StartQueueFactory = () => {
  const queueRepo = new QueueRepository();

  const useCase = new StartQueueUseCase(
    queueRepo
  );

  const controller = new StartQueueController(useCase);

  return { controller, useCase };
}