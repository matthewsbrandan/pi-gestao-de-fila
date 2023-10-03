import { OrderStatus } from "../../../entities/Order";
import { IOrderRepository } from "../../../repositories/IOrderRepository";

export class UpdateOrderUseCase{
  constructor(private orderRepo: IOrderRepository){}

  async execute({ id, status }:{ id: number, status: OrderStatus}){
    if(!id) throw new Error('Não foi possível identificar o pedido')
    if(!status) throw new Error('É obrigatório informar o status do pedido')
    
    return await this.orderRepo.updateOrderStatus(Number(id), status)
  }
}