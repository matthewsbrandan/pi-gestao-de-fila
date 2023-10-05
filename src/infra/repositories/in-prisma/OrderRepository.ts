import { Order, OrderStatus } from "../../../domain/entities/Order";
import { IOrderRepository, OrderFilters } from "../../../domain/repositories/IOrderRepository";
import db from "../../config/prisma";

export class OrderRepository implements IOrderRepository{
  _instance(response: any){
    return new Order(response, response.id ?? undefined)
  }
  async addOrder(props: Omit<Order, "id">): Promise<Order> {
    const res = await db.order.create({
      data: props
    })

    return this._instance(res)
  }
  async findOrderById(id: number): Promise<Order> {
    const res = await db.order.findFirst({
      where: { id }
    })

    if(!res) throw new Error(
      'Pedido não encontrado'
    )

    return this._instance(res);
  }
  async findOrdersByQueueId(queue_id: number, filters?: OrderFilters): Promise<Order[]> {
    const { exclude_ids } = filters ?? { exclude_ids: [] }
    const responses = await db.order.findMany({
      where: {
        queue_id,
        id: { notIn: exclude_ids ?? [] },
        ...(filters.status ? {
          status: { in: filters.status }
        }:{})
      },
    })

    return responses.map((response) => this._instance(response))
  }
  async updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
    await this.findOrderById(id);

    const res = await db.order.update({ 
      where : { id },
      data  : { status }
    })

    return this._instance(res);
  }
  async removeOrder(id: number): Promise<void> {
    await this.findOrderById(id);

    await db.order.delete({ where : { id } })
  }
}