import { IQueueRepository } from "../../../repositories/IQueueRepository";
import { FindStartedQueueUseCase } from "../FindStartedQueue/FindStartedQueueUseCase";

export class CloseQueueUseCase{
  constructor(  
    private queueRepo: IQueueRepository
  ){}

  async execute(){
    const queue = await this.queueRepo.findStartedQueue()

    if(!queue) throw new Error(
      'Não existe nenhuma fila ativa'
    )

    await this.queueRepo.closeQueue(queue.id)
  }
}