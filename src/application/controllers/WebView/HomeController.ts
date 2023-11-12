import { Request, Response } from "express";
import { FindStartedQueueUseCase } from "../../../domain/useCases/Queue/FindStartedQueue/FindStartedQueueUseCase";
import { Controller, HeaderOptionsType } from "../Controller";
import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { Order } from "../../../domain/entities/Order";
import { Queue } from "../../../domain/entities/Queue";
import { DashboardUseCase } from "../../../domain/useCases/WebView/Dashboard/DashboardUseCase";

export class HomeController extends Controller{
  constructor(
    private findStartedQueue: FindStartedQueueUseCase,
    private orderRepo: IOrderRepository,
    private dashUseCase: DashboardUseCase
  ){ super() }

  async handle(request: Request, response: Response){
    this.init(request, response)

    try {
      const headerOptions : HeaderOptionsType = { import: { css: ['modal.css'] } }

      if(this.auth_user){
        const queue = await this.findStartedQueue.execute()
      
        if(this.auth_user.type === 'client'){
          if(queue) return this.view('queue.ejs', { data: { queue } })

          return this.view('error.ejs', {
            error: {
              title: 'Indisponível',
              message: 'Não existe nenhuma fila de atendimento iniciada',
              goBack: false,
            }
          })
        }

        const { charts } = queue ? await this.getOrderByHour({ queue }) : { charts: { } }

        return this.view('index.ejs', { headerOptions, data: { queue, charts } })
      }

      return this.view('welcome.ejs', { headerOptions })
    } catch (error) {
      return response.status(500).json({
        result: false,
        response: error.message
      })
    }
  }

  async getOrderByHour({ queue }:{ queue: Queue }) : Promise<{ charts: any }> {
    const orders = await this.orderRepo.findOrdersOnLast30Days()

    const ordersByHour : Record<string, Order[]> = {};

    orders.forEach(order => {
      if(order.created_at_formatted){
        if(queue && order.queue_id === queue.id){
          let ymdh = order.created_at_formatted.split(':')[0]
          
          if(ordersByHour[ymdh]) ordersByHour[ymdh].push(order)
          else ordersByHour[ymdh] = [order]
        }
      }
    })

    const charts = { byHour: this.dashUseCase.handleChartByHour({ ordersByHour }) }

    return { charts }
  }
}