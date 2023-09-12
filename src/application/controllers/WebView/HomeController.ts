import { Request, Response } from "express";
import { FindStartedQueueUseCase } from "../../../domain/useCases/Queue/FindStartedQueue/FindStartedQueueUseCase";
import { User } from "../../../domain/entities/User";

export class HomeController{
  constructor(
    private findStartedQueue: FindStartedQueueUseCase
  ){}

  async handle(request: Request, response: Response){
    try {
      const user = request.user as User;
      const headerOptions = {
        import: { css: ['modal.css'] }
      }
      if(user){
        // [x] VERIFICAR TIPO DE USUÁRIO
        //     [x] SE FOR MANAGER E EXISTIR FILA, IR PARA MANAGE-QUEUE
        //     [x] SE FOR CLIENT E EXISTIR FILA, IR PARA LISTA DE PEDIDOS PARA SELECIONAR
        //         [ ] SE NÃO HOUVER FILA ABERTA MOSTRAR UMA MENSAGEM DE ERRO

        const queue = await this.findStartedQueue.execute()
        if(queue){
          if(user.type === 'manager') return response.render('manage-queue', {
            queue
          });
          else return response.render('queue', {
            queue
          })
        }
        return response.render('index.ejs', { headerOptions })
      }

      return response.render('welcome.ejs', { headerOptions })
    } catch (error) {
      return response.status(500).json({
        result: false,
        response: error.message
      })
    }
  }
}