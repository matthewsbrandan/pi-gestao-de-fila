import { Order } from "../../../entities/Order";
import { Product } from "../../../entities/Product";
import { User } from "../../../entities/User";
import { IOrderItemRepository } from "../../../repositories/IOrderItemRepository";
import { IOrderRepository } from "../../../repositories/IOrderRepository";
import { IQueueRepository } from "../../../repositories/IQueueRepository";

export class DashboardUseCase{
  constructor(
    private orderRepo : IOrderRepository,
    private orderItemRepo : IOrderItemRepository,
    private queueRepo : IQueueRepository
  ){}

  async execute(){
    const orders = await this.orderRepo.findOrdersOnLast30Days({ includes: ['user', ] })

    const ordersByHour : Record<string, Order[]> = {};

    const queue = await this.queueRepo.findStartedQueue()
    
    const users : Record<string, {
      amount: number,
      user: User
    }> = {}

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 8);
    sevenDaysAgo.setHours(0,0,0,0)

    const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const ordersByWeekDay : Record<string, { weekday: string, orders: Order[] }> = {}

    Array.from({ length: 7 }).forEach(() => {
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() + 1);
      let weekday = sevenDaysAgo.getDay()
      ordersByWeekDay[`${
        sevenDaysAgo.getFullYear()
      }-${
        sevenDaysAgo.getMonth() + 1
      }-${
        sevenDaysAgo.getDate()
      }`] = { weekday: weekdays[weekday], orders: [] }
    })

    const datesOfWeek = Object.keys(ordersByWeekDay)

    orders.forEach(order => {
      if(users[order.user_id]) users[order.user_id].amount++;
      else users[order.user_id] = { amount: 1, user: order.user }

      if(order.created_at_formatted){
        if(queue && order.queue_id === queue.id){
          let ymdh = order.created_at_formatted.split(':')[0]
          
          if(ordersByHour[ymdh]) ordersByHour[ymdh].push(order)
          else ordersByHour[ymdh] = [order]
        }

        let ymd = order.created_at_formatted.split(' ')[0]
        if(datesOfWeek.includes(ymd)) ordersByWeekDay[ymd].orders.push(order)
      }
    })
    
    const occurrenceOfUsers : { amount: number, user: User }[] = []
    Object.values(users).forEach((amountAndUser) => {
      this.orderedInsertion(occurrenceOfUsers, amountAndUser);
    })

    const orderItems = await this.orderItemRepo.findByOrderId(orders.map((o) => o.id), {
      includes: ['product']
    })

    const products : Record<string, { amount: number, product: Product }> = {}    
    orderItems.forEach((item) => {
      if(products[item.product_id]) products[item.product_id].amount+= item.quantity
      else products[item.product_id] = {
        amount: item.quantity,
        product: item.product
      }
    })

    const occurrenceOfProducts : { amount: number, product: Product }[] = [];
    Object.values(products).forEach((amountAndProduct) => {
      this.orderedInsertion(occurrenceOfProducts, amountAndProduct);
    })
    // [x] volumetria por hora
    // [x] volumetria por dia da semana
    // [x] clientes mais frequentes  --- obter os usuários de findOrderOnLast30Days
    // [x] produtos mais vendido

    return {
      weekdays,
      ordersByHour,
      ordersByWeekDay,
      occurrenceOfUsers,
      occurrenceOfProducts,
    }
  }
  orderedInsertion(sortedArray: any[], item: any) {
    let insertionPosition = 0;

    while(
      insertionPosition < sortedArray.length && 
      sortedArray[insertionPosition].amount < item.amount
    ) insertionPosition++;
  
    sortedArray.splice(insertionPosition, 0, item);
  }
}