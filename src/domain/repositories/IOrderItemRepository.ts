import { OrderItem } from "../entities/OrderItem";

export interface IOrderItemRepository{
  findOrderItemsOnLast30Days(props?: { includes?: ('product' | 'order')[] }) : Promise<OrderItem[]>
}