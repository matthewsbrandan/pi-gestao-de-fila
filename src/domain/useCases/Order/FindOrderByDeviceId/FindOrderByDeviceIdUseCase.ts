import { IOrderRepository } from "../../../repositories/IOrderRepository";
import { IQueueRepository } from "../../../repositories/IQueueRepository";

export class FindOrderByDeviceIdUseCase{
  constructor(
    private queueRepo: IQueueRepository,
    private orderRepo: IOrderRepository
  ){}

  async execute({ device_id }:{ device_id: number }){
    if(typeof device_id !== 'number' || isNaN(device_id)) throw new Error(
      'Informe um id de dispositivo válido'
    )

    const queue = await this.queueRepo.findStartedQueue()

    if(!queue) throw new Error(
      'Não há nenhuma fila em andamento'
    )
    
    const findedOrder = await this.orderRepo.findOrderByQueueIdNotWithdrawed(queue.id)

    if(!findedOrder) throw new Error(
      'Nenhuma ordem encontrada para este dispositivo'
    )
  
    return findedOrder
  }
}