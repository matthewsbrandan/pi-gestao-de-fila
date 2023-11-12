import { Order, OrderStatus } from "../../../domain/entities/Order";
import { IOrderRepository, OrderFilters } from "../../../domain/repositories/IOrderRepository";
import db from "../../config/prisma";

export class OrderRepository implements IOrderRepository{
  _instance(response: any){
    return new Order(response, response.id ?? undefined)
  }
  async addOrder(props: Omit<Order, "id" | "created_at">): Promise<Order> {
    const res = await db.order.create({
      data: {
        name: props.name,
        total_price: props.total_price,
        status: props.status,
        user_id: props.user_id,
        device_id: props.device_id,
        queue_id: props.queue_id,
        created_at: new Date(),
        updated_at: new Date(),
      }
    })

    if(!res) throw new Error(
      'Não foi possível criar o pedido'
    )

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
  async findOrdersOnLast30Days(props?: { includes?: ("user" | "queue")[]; }) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const orders = await db.order.findMany({
      where: {
        created_at: { lte: startDate }
      },
      ...(props?.includes ? {
        include: props.includes.reduce((acc, curr) => ({ ...acc, [curr]: true }),{}) as {}
      }:{})
    })

    return orders.map(order => this._instance(order))
  }
}