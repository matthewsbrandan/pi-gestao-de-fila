import { Queue } from "../entities/Queue";

export interface IQueueRepository{
  findOpenedQueueByUserId(user_id: string) : Promise<Queue>
  createQueue(props: Omit<Queue, 'id'>) : Promise<Queue>
}