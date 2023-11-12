import { OrderItem } from "../entities/OrderItem";

export interface IOrderItemRepository{
  findByOrderId(order_ids: number[], props?: { includes?: ('product' | 'order')[] }) : Promise<OrderItem[]>
  createOrderItem(orderItem: Omit<OrderItem, 'id'>) : Promise<OrderItem>
  excludeOrderItem(order_item_id: number) : Promise<void>
}