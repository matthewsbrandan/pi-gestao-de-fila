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
  async createOrderItem(orderItem: Omit<OrderItem, "id">): Promise<OrderItem> {
    const response = await db.orderItem.create({
      data: {
        quantity: orderItem.quantity,
        unit_price: orderItem.unit_price,
        order_id: orderItem.order_id,
        product_id: orderItem.product_id,
      }
    })

    return this._instance(response)
  }
  async excludeOrderItem(order_item_id: number): Promise<void> {
    await db.orderItem.delete({ where: { id: order_item_id } })
  }
}