import { IOrderItemRepository } from "../../../repositories/IOrderItemRepository";
import { IOrderRepository } from "../../../repositories/IOrderRepository";

export class DashboardUseCase{
  constructor(
    private orderRepo : IOrderRepository,
    private orderItemRepo : IOrderItemRepository
  ){}

  async execute(){

    this.orderRepo.findOrdersOnLast30Days({ includes: ['user'] })
    // [ ] volumetria por hora
    // [ ] volumetria por dia da semana

    this.orderItemRepo.findOrderItemsOnLast30Days()
    // [ ] produtos mais vendido


    // [ ] clientes mais frequentes  --- obter os usuários de findOrderOnLast30Days
  }
}