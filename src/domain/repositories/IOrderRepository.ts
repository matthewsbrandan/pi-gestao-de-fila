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
  findOrderByQueueIdAndDeviceIdNotWithdrawed(queue_id: number, device_id: number) : Promise<Order | undefined>
  findOrdersOnLast30Days(props?: { includes?: ('user' | 'queue')[] }) : Promise<Order[]>
}