import { Queue } from "../../../domain/entities/Queue";
import { CreateQueueProps, IQueueRepository } from "../../../domain/repositories/IQueueRepository";
import db from "../../config/prisma";

export class QueueRepository implements IQueueRepository{
  _instance(response: any) : Queue {
    return new Queue(response, response.id ?? undefined)
  }

  async findStartedQueue(): Promise<Queue | undefined> {
    const findedQueue = db.queue.findFirst({
      where: { is_open: true }
    })

    if(!findedQueue) return;

    return this._instance(findedQueue)
  }
  async createQueue({ is_autoincrement, max_length, user_id, start_in }: CreateQueueProps): Promise<Queue> {
    const existsStartedQueue = !!await this.findStartedQueue()
    if(existsStartedQueue) throw new Error(
      'Já existe uma fila iniciada. É necessário encerrar a primeira fila para poder abrir uma nova'
    )

    const createdQueue = await db.queue.create({
      data: {
        started_at: new Date(),
        is_open: true,
        is_autoincrement,
        max_length,
        start_in,
        user_id,
      }
    })
    
    return this._instance(createdQueue);
  }

  async closeQueue(queue_id: number): Promise<void> {
    await db.queue.update({ 
      where: { id: queue_id   },
      data:  { is_open: false }
    })
  }
}