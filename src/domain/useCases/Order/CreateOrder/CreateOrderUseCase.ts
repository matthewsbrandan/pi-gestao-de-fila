import { Order } from "../../../entities/Order";
import { IOrderRepository } from "../../../repositories/IOrderRepository";

export class CreateOrderUseCase{
  constructor(private orderRepo: IOrderRepository){}

  async execute(order: Omit<Order, 'id'>){
    const createdOrder = await this.orderRepo.addOrder(order);

    return createdOrder
  }
}