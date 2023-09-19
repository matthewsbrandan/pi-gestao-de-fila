import { Request, Response } from "express";
import { FindStartedQueueUseCase } from "../../../domain/useCases/Queue/FindStartedQueue/FindStartedQueueUseCase";
import { Controller } from "../Controller";

export class FindStartedQueueController extends Controller{
  constructor(
    private useCase: FindStartedQueueUseCase
  ){ super() }

  async handle(request: Request, response: Response){
    this.init(request, response)

    try {
      const data = await this.useCase.execute();

      return response.status(200).json({
        result: true,
        response: "Pesquisa realizada com sucesso",
        data
      })
    } catch (error) {
      return response.status(500).json({
        result: false,
        response: error.message
      })
    }
  }
}