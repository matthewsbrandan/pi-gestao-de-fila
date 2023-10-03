import { Order, OrderStatus } from "../entities/Order";

export interface OrderFilters{
  exclude_ids?: number[]
  status?: OrderStatus[]
}
export interface IOrderRepository{
  addOrder(props: Omit<Order, 'id'>) : Promise<Order>
  updateOrderStatus(id: number, status: OrderStatus) : Promise<Order>
  removeOrder(id: number) : Promise<void>
  findOrderById(id: number) : Promise<Order>
  findOrdersByQueueId(queue_id: number, filters?: OrderFilters) : Promise<Order[]>
}