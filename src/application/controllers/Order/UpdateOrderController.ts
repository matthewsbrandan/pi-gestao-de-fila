import { Request, Response } from "express";
import { Controller } from "../Controller";
import { UpdateOrderUseCase } from "../../../domain/useCases/Order/UpdateOrder/UpdateOrderUseCase";

export class UpdateOrderController extends Controller{
  constructor(
    private useCase: UpdateOrderUseCase
  ){ super() }

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