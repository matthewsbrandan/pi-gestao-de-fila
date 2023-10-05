import { Request, Response } from "express";
import { FindStartedQueueUseCase } from "../../../domain/useCases/Queue/FindStartedQueue/FindStartedQueueUseCase";
import { Controller } from "../Controller";
import { route } from "../../../infra/routes/routenames";

export class QueueController extends Controller{
  constructor(
    private findStartedQueue: FindStartedQueueUseCase
  ){ super() }

  async handle(request: Request, response: Response){
    this.init(request, response)

    try {
      const queue = await this.findStartedQueue.execute()
      if(!queue) return this.view('error.ejs', {
        error: {
          title: 'Indisponível',
          message: 'Não existe nenhuma fila de atendimento iniciada',
        }
      })

      return this.view('queue.ejs', {
        headerOptions: { import: { css: ['drag-and-drop.css','modal.css'] } },
        data: { queue }
      })
    } catch (error) {
      this.notify('error', error.message)
      return response.redirect(route.home())
    }
  }
}