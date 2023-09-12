import { Request, Response } from "express";
import { FindStartedQueueUseCase } from "../../../domain/useCases/Queue/FindStartedQueue/FindStartedQueueUseCase";

export class FindStartedQueueController{
  constructor(
    private useCase: FindStartedQueueUseCase
  ){}

  async handle(request: Request, response: Response){
    try {
      const data = await this.useCase.execute();

      return response.status(200).json({
        result: true,
        response: "Mensagem de sucesso",
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