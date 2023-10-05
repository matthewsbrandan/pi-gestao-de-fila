import { Request, Response } from "express";
import { Controller } from "../Controller";
import { UpdateOrderUseCase } from "../../../domain/useCases/Order/UpdateOrder/UpdateOrderUseCase";

export class UpdateOrderController extends Controller{
  constructor(
    private useCase: UpdateOrderUseCase
  ){ super() }

  async handle(request: Request, response: Response){
    try {
      const { id, status } = request.body;

      const data = await this.useCase.execute({
        id,
        status
      });

      return response.status(200).json({
        result: true,
        response: "Pedido atualizado",
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