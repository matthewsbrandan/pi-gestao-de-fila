import { Request, Response } from "express";
import { FindStartedQueueUseCase } from "../../../domain/useCases/Queue/FindStartedQueue/FindStartedQueueUseCase";

export class HomeController{
  constructor(
    private findStartedQueue: FindStartedQueueUseCase
  ){}

  async handle(request: Request, response: Response){
    try {
      const user = request.user;
      
      if(user){
        console.log('[logged-user]', { user })
        // [ ] VERIFICAR TIPO DE USUÁRIO
        //     [ ] SE FOR MANAGER E EXISTIR FILA, IR PARA MANAGE-QUEUE
        //     [ ] SE FOR CLIENT E EXISTIR FILA, IR PARA LISTA DE PEDIDOS PARA SELECIONAR
        //         [ ] SE NÃO HOUVER FILA ABERTA MOSTRAR UMA MENSAGEM DE ERRO

        const queue = await this.findStartedQueue.execute()
        if(queue) return response.render('manage-queue', {
          queue
        });

        return response.render('index.ejs')
      }

      return response.render('welcome.ejs', {
        headerOptions: {
          import: { css: ['modal.css'] }
        }
      })
    } catch (error) {
      return response.status(500).json({
        result: false,
        response: error.message
      })
    }
  }
}