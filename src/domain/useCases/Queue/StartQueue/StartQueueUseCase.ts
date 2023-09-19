import { IQueueRepository } from "../../../repositories/IQueueRepository";

export class StartQueueUseCase{
  constructor(
    private queueRepo: IQueueRepository
  ){}

  async execute(user_id: number){
    const queue = await this.queueRepo.findStartedQueue()

    if(queue) throw new Error('Já existe uma fila iniciada')

    const createdQueue = await this.queueRepo.createQueue({
      is_autoincrement: true,
      user_id
    })
    
    return createdQueue
  }
}