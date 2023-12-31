import { Queue } from "../../../domain/entities/Queue";
import { CreateQueueProps, IQueueRepository } from "../../../domain/repositories/IQueueRepository";
import { delay } from "./utils";

const queues : Queue[] = []
export class QueueRepository implements IQueueRepository{
  _instance(response: any){
    return new Queue(response, response.id ?? undefined)
  }

  async findStartedQueue(): Promise<Queue | undefined> {
    await delay()

    const findedQueue = queues.find(q => q.is_open)
    if(!findedQueue) return

    return this._instance(findedQueue)
  }
  async createQueue(props: CreateQueueProps): Promise<Queue> {
    const existsStartedQueue = !!await this.findStartedQueue()
    if(existsStartedQueue) throw new Error(
      'Já existe uma fila iniciada. É necessário encerrar a primeira fila para poder abrir uma nova'
    )

    const instancied = this._instance(props)
    queues.push(instancied)
    
    return instancied;
  }
}