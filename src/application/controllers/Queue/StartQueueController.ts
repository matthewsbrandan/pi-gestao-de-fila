import { Request, Response } from "express";
import { StartQueueUseCase } from "../../../domain/useCases/Queue/StartQueue/StartQueueUseCase";
import { Controller } from "../Controller";
import { route } from "../../../infra/routes/routenames";

export class StartQueueController extends Controller{
  constructor(
    private useCase: StartQueueUseCase
  ){ super() }

  async handle(request: Request, response: Response){
    this.init(request, response)

    try {
      if(!this.auth_user || this.auth_user.type !== "manager") throw new Error(
        'Você não tem permissão de iniciar um fila'
      )

      await this.useCase.execute(this.auth_user.id);

      this.notify('success', 'Fila de pedidos iniciada')
      
      return response.redirect(route.queue.manage())
    } catch (error) {
      this.notify('error', error.message)
      return response.redirect(route.home())
    }
  }
}