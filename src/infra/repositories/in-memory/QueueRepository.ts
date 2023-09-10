import { Queue } from "../../../domain/entities/Queue";
import { IQueueRepository } from "../../../domain/repositories/IQueueRepository";
import { delay } from "./utils";

const queues : Queue[] = []
export class QueueRepository implements IQueueRepository{
  _instance(response: any){
    return new Queue(response, response.id ?? undefined)
  }

  async findOpenedQueueByUserId(user_id: string): Promise<Queue> {
    await delay()

    const findedQueue = queues.find(q => q.user_id === user_id && q.is_open)
    if(!findedQueue) throw new Error(
      'Ainda não foi iniciado nenhum controle de filas.'
    )

    return this._instance(findedQueue)
  }
  async createQueue(props: Omit<Queue, "id">): Promise<Queue> {
    await delay()

    const instancied = this._instance(props)
    queues.push(instancied)
    
    return instancied;
  }
}