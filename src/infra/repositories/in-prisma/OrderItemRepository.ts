import { OrderItem } from "../../../domain/entities/OrderItem";
import { IOrderItemRepository } from "../../../domain/repositories/IOrderItemRepository";
import db from "../../config/prisma";

export class OrderItemRepository implements IOrderItemRepository{
  _instance(response: any){
    return new OrderItem(response, response.id ?? undefined)
  }
  async findByOrderId(order_ids: number[], props?: { includes?: ("product" | "order")[]; }): Promise<OrderItem[]> {
    const responses = await db.orderItem.findMany({
      where: { order_id: { in: order_ids } },
      ...(props?.includes ? {
        include: props.includes.reduce((acc, curr) => ({ ...acc, [curr]: true }),{}) as {}
      }:{})
    })

    return responses.map(response => this._instance(response))
  }
}