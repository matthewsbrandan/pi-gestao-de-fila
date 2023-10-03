import { OrderStatus } from "../../../entities/Order";
import { IOrderRepository } from "../../../repositories/IOrderRepository";
import { FindStartedQueueUseCase } from "../../Queue/FindStartedQueue/FindStartedQueueUseCase";

interface FindOrdersByStartedQueueProps{
  exclude_ids: number[]
  status?: OrderStatus[]
}
export class FindOrdersByStartedQueueUseCase{
  constructor(
    private orderRepo: IOrderRepository,
    private findStartedQueue: FindStartedQueueUseCase
  ){}

  async execute({ exclude_ids, status }: FindOrdersByStartedQueueProps){
    const queue = await this.findStartedQueue.execute()

    if(!queue) return []
    const orders = await this.orderRepo.findOrdersByQueueId(queue.id, {
      exclude_ids,
      status
    })
    return orders;
  }
}