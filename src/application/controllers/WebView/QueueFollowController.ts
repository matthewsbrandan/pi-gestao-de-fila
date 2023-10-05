import { Request, Response } from "express";
import { FindStartedQueueUseCase } from "../../../domain/useCases/Queue/FindStartedQueue/FindStartedQueueUseCase";
import { Controller } from "../Controller";
import { route } from "../../../infra/routes/routenames";
import { Order } from "@prisma/client";
import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";

export class QueueFollowController extends Controller{
  constructor(
    private findStartedQueue: FindStartedQueueUseCase,
    private orderRepo: IOrderRepository
  ){ super() }

  async handle(request: Request, response: Response){
    this.init(request, response)

    try{
      const queue = await this.findStartedQueue.execute()
      if(!queue) return this.view('error.ejs', {
        error: {
          title: 'Indisponível',
          message: 'Não existe nenhuma fila de atendimento iniciada',
        }
      })

      let order : Order | undefined = undefined
      if(request.params.order_id){
        const order_id = Number(request.params.order_id);

        if(isNaN(order_id)) this.notify('error', 'Número de pedido inválido')
        else{
          try{
            order = await this.orderRepo.findOrderById(order_id)
            if(!order) this.notify('error', 'Pedido não encontrado')
          }catch(e){
            this.notify('error', e.message ?? 'Houve um erro ao tentar encontrar o pedido')
          }
        }
      }

      return this.view('follow.ejs', {
        headerOptions: { import: { css: ['drag-and-drop.css','modal.css'] } },
        data: {
          queue,
          order,
          is_following: true
        }
      })
    } catch (error) {
      this.notify('error', error.message)
      return response.redirect(route.home())
    }
  }
}