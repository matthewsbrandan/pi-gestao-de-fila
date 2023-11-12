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
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0,0,0,0)

    const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const ordersByWeekDay : Record<string, { weekday: string, orders: Order[] }> = {}

    Array.from({ length: 7 }).forEach(() => {
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() + 1);
      let weekday = sevenDaysAgo.getDay()
      ordersByWeekDay[`${
        sevenDaysAgo.getFullYear()
      }-${
        String(sevenDaysAgo.getMonth() + 1).padStart(2, '0')
      }-${
        String(sevenDaysAgo.getDate()).padStart(2, '0')
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

    const charts = {
      byHour: this.handleChartByHour({ ordersByHour }),
      byWeekday: this.handleChartByWeekday({ ordersByWeekDay })
    }

    return {
      charts,
      weekdays,
      ordersByHour,
      ordersByWeekDay,
      occurrenceOfUsers,
      occurrenceOfProducts,
    }
  }

  handleChartByHour({ ordersByHour }:{
    ordersByHour: Record<string, Order[]>
  }) : undefined | { labels: string[], data: number[], suggestedMax: number } {
    const filledKeys = Object.keys(ordersByHour);
    if(filledKeys.length === 0) return;
    
    const allHours : Record<string, string>= {};

    const formatLabel = ({ date, hour, onlyHour = true }:{ date: string, hour: string, onlyHour?: boolean }) => {
      if(onlyHour) return `${hour}h`

      const splited = date.split('-')

      return `${splited[1]}/${splited[2]} ${hour}h`
    }

    filledKeys.forEach((key, i) => {
      const splited = key.split(' ')
      if(splited.length !== 2) return;

      const date = splited[0]
      const hour = splited[1]

      allHours[key] = formatLabel({
        date,
        hour
      }) 

      if(filledKeys.length === (i + 1)) return;

      //#region HANDLE NEXT
      const next = filledKeys[i + 1]

      const nextSplited = next.split(' ')
      if(nextSplited.length !== 2) return;

      const nextDate = nextSplited[0]
      const nextHour = nextSplited[1]
      //#endregion HANDLE NEXT
      
      //#region VALIDATE NEXT DATE
      if(hour !== '23' && date === nextDate && (Number(hour) + 1) === Number(nextHour)) return;

      const nextDay = new Date(`${date}T${String((
        new Date()
      ).getTimezoneOffset() / 60).padStart(2, '0')}:00:00.000z`)

      nextDay.setDate(nextDay.getDate() + 1)

      let expectedNextDate = `${nextDay.getFullYear()}-${
        String(nextDay.getMonth() + 1).padStart(2, '0')
      }-${
        String(nextDay.getDate()).padStart(2, '0')
      }`

      if(hour === '23' && expectedNextDate === nextDate && '00' === nextHour) return
      //#endregion VALIDATE NEXT DATE

      const generateHoursToMax = ({ date, nextDate, nextHour, hour, onlyHour = false }:{
        date: string,
        nextDate: string,
        nextHour: number,
        hour: number,
        onlyHour?: boolean
      }) => {
        const targetHourOnThisDate = date === nextDate ? Number(nextHour) : 23
        const countHoursToMake = targetHourOnThisDate - Number(hour)
    
        Array.from({ length: countHoursToMake }).forEach((_, i) => {
          const currHour = String(
            Number(hour) + i + 1
          ).padStart(2, '0')
          const key = `${date} ${currHour}`

          allHours[key] = formatLabel({
            date,
            hour: currHour,
            onlyHour
          })
        })
      }
      
      if(hour !== '23') generateHoursToMax({
        date,
        nextDate,
        nextHour: Number(hour),
        hour: Number(hour),
        onlyHour: true
      })

      if(nextDate >= expectedNextDate){
        do{
          const key = `${expectedNextDate} 00`
          allHours[key] = formatLabel({
            date: expectedNextDate,
            hour: '00',
            onlyHour: false
          })

          generateHoursToMax({
            date: expectedNextDate,
            nextDate,
            nextHour: Number(nextHour),
            hour: 0
          })

          nextDay.setDate(nextDay.getDate() + 1)

          expectedNextDate = `${nextDay.getFullYear()}-${
            String(nextDay.getMonth() + 1).padStart(2, '0')
          }-${
            String(nextDay.getDate()).padStart(2, '0')
          }`
        }while(expectedNextDate <= nextDate)
      }
    })

    const labels = [...Object.values(allHours)]
    const data = Object.keys(allHours).map((label) => ordersByHour[label] ? ordersByHour[label].length : 0)

    const max = Math.max(...data)
    const suggestedMax = max === 0 ? 5 : Math.ceil(
      max * 1.1
    )

    return {
      labels,
      data,
      suggestedMax
    }
  }

  handleChartByWeekday({ ordersByWeekDay }:{ 
    ordersByWeekDay: Record<string, { weekday: string, orders: Order[] }>
  }) : undefined | {
    labels: string[], data: number[], suggestedMax: number 
  } {
    const translate = {
      'sunday': 'DOM',
      'monday': 'SEG',
      'tuesday': 'TER',
      'wednesday': 'QUA',
      'thursday': 'QUI',
      'friday': 'SEX',
      'saturday': 'SAB'
    }
    const labels : string[] = [];
    const data : number[] = [];

    Object.values(ordersByWeekDay).forEach((obw) => {
      labels.push(translate[obw.weekday])
      data.push(obw.orders.length)
    })

    const max = Math.max(...data)
    const suggestedMax = max === 0 ? 5 : Math.ceil(
      max * 1.1
    )

    return {
      suggestedMax,
      labels,
      data,
    }
  }
  orderedInsertion(sortedArray: any[], item: any) {
    let insertionPosition = 0;

    while(
      insertionPosition < sortedArray.length && 
      sortedArray[insertionPosition].amount > item.amount
    ) insertionPosition++;
  
    sortedArray.splice(insertionPosition, 0, item);
  }
}