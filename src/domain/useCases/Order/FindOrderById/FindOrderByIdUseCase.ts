import { IOrderRepository } from "../../../repositories/IOrderRepository";

export class FindOrderByIdUseCase{
  constructor(
    private orderRepo: IOrderRepository
  ){}

  async execute({ order_id }:{ order_id: number }){
    if(!order_id || typeof order_id !== 'number' || isNaN(order_id)) throw new Error(
      'É obrigatório informar um id válido'
    )

    const order = await this.orderRepo.findOrderById(order_id)

    if(!order) throw new Error(
      'Pedido não encontrado'
    )

    return order
  }
}