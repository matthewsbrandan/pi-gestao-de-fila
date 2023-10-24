import { OrderItem } from "../entities/OrderItem";

export interface IOrderItemRepository{
  findByOrderId(order_ids: number[], props?: { includes?: ('product' | 'order')[] }) : Promise<OrderItem[]>
}