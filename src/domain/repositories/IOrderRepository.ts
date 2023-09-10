import { Order, OrderStatus } from "../entities/Order";

export interface IOrderRepository{
  addOrder(props: Omit<Order, 'id'>) : Promise<Order>
  updateOrderStatus(id: string, status: OrderStatus) : Promise<Order>
  removeOrder(id: string) : Promise<void>
  findOrderById(id: string) : Promise<Order>
  findOrdersByQueueId(queue_id: string) : Promise<Order[]>
}