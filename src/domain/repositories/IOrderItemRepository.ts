import { OrderItem } from "../entities/OrderItem";

export interface IOrderItemRepository{
  findOrderItemsOnLast30Days() : Promise<OrderItem>
}