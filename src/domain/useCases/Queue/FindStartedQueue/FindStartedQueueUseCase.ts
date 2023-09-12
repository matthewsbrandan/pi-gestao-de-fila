import { IQueueRepository } from "../../../repositories/IQueueRepository";

export class FindStartedQueueUseCase{
  constructor(
    private queueRepo: IQueueRepository
  ){}

  async execute(){
    const queue = await this.queueRepo.findStartedQueue()
    return queue
  }
}