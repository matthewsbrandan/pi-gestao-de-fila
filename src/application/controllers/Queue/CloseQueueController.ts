import { Request, Response } from "express";
import { Controller } from "../Controller";
import { CloseQueueUseCase } from "../../../domain/useCases/Queue/CloseQueue/CloseQueueUseCase";
import { route } from "../../../infra/routes/routenames";

export class CloseQueueController extends Controller{
  constructor(
    private useCase: CloseQueueUseCase
  ){ super() }

  async handle(request: Request, response: Response){
    try {
      this.init(request, response)

      await this.useCase.execute();

      return this.redirectWithMessage(route.home(), 'success', 'Fila finalizada')
    } catch (error) {
      return this.redirectWithMessage(route.home(), 'error', error.message)
    }
  }
}