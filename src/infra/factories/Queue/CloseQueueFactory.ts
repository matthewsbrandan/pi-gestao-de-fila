import { CloseQueueController } from "../../../application/controllers/Queue/CloseQueueController";
import { CloseQueueUseCase } from "../../../domain/useCases/Queue/CloseQueue/CloseQueueUseCase";
import { QueueRepository } from "../../repositories/in-prisma/QueueRepository";
import { FindStartedQueueFactory } from "./FindStartedQueueFactory";

export const CloseQueueFactory = () => {
  const queueRepo = new QueueRepository();
  const useCase = new CloseQueueUseCase(queueRepo);

  const controller = new CloseQueueController(useCase);

  return controller;
}