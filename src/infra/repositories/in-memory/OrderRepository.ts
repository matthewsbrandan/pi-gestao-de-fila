import { Order, OrderStatus } from "../../../domain/entities/Order";
import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { delay } from "./utils";

let orders: Order[] = []
export class OrderRepository implements IOrderRepository{
  _instance(response: any){
    return new Order(response, response.id ?? undefined)
  }

  async addOrder(props: Omit<Order, "id">): Promise<Order> {
    await delay()

    const instancied = this._instance(props)
    orders.push(instancied)

    return instancied
  }
  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    await delay()

    const findedOrder = this.findOrderById(id)

    const instancied = this._instance({
      ...findedOrder,
      status
    })

    orders.push(instancied)

    return instancied
  }
  async removeOrder(id: string): Promise<void> {
    await delay()

    let isFinded = false;
    orders = orders.filter((order) => {
      if(order.id === id){
        isFinded = true
        return false
      }
      return true
    })

    if(!isFinded) throw new Error(
      'Não foi possível apagar esse pedido'
    )
  }
  async findOrderById(id: string) : Promise<Order> {
    await delay()

    const findedOrder = orders.find(o => o.id === id)
    if(!findedOrder) throw new Error(
      'Não foi possível localizar este pedido'
    )

    return this._instance(findedOrder)
  }
  async findOrdersByQueueId(queue_id: string): Promise<Order[]> {
    await delay()

    const findedOrders = orders.filter(o => o.queue_id === queue_id)
    return findedOrders.map(o => this._instance(o))
  }
}