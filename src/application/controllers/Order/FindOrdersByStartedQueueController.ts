import { Request, Response } from "express";
import { Controller } from "../Controller";
import { FindOrdersByStartedQueueUseCase } from "../../../domain/useCases/Order/FindOrdersByStartedQueue/FindOrdersByStartedQueueUseCase";

export class FindOrdersByStartedQueueController extends Controller{
  constructor(
    private useCase: FindOrdersByStartedQueueUseCase
  ){ super() }

  async handle(request: Request, response: Response){
    try {
      const { exclude_ids } = request.body;
      const data = await this.useCase.execute({ exclude_ids });

      return response.status(200).json({
        result: true,
        response: "Orders",
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