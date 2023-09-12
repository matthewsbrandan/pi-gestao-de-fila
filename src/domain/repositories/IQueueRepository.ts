import { Queue } from "../entities/Queue";

export interface CreateQueueProps extends Omit<Queue, 'id' | 'started_at' | 'is_open' | 'ended_at' | 'orders'>{}
export interface IQueueRepository{
  findStartedQueue() : Promise<Queue | undefined>
  createQueue(props: CreateQueueProps) : Promise<Queue>
}