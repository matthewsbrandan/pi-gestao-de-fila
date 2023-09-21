import { Request, Response } from "express";
import { FindStartedQueueUseCase } from "../../../domain/useCases/Queue/FindStartedQueue/FindStartedQueueUseCase";
import { Controller, HeaderOptionsType } from "../Controller";

export class HomeController extends Controller{
  constructor(
    private findStartedQueue: FindStartedQueueUseCase
  ){ super() }

  async handle(request: Request, response: Response){
    this.init(request, response)

    try {
      const headerOptions : HeaderOptionsType = { import: { css: ['modal.css'] } }

      if(this.auth_user){
        const queue = await this.findStartedQueue.execute()
        if(queue){          
          if(this.auth_user.type === 'manager') return this.view('manage-queue.ejs', {
            headerOptions: { import: { css: ['drag-and-drop.css'] } },
            data: queue,
          });
          else return this.view('queue', { data: queue })
        }

        if(this.auth_user.type === 'client') return this.view('error.ejs', {
          error: {
            title: 'Indisponível',
            message: 'Não existe nenhuma fila de atendimento iniciada',
            goBack: false,
          }
        })
        return this.view('index.ejs', { headerOptions })
      }

      return this.view('welcome.ejs', { headerOptions })
    } catch (error) {
      return response.status(500).json({
        result: false,
        response: error.message
      })
    }
  }
}