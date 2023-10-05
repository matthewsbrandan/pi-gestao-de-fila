import { Request, Response } from "express";
import { Controller } from "../Controller";
import { CreateOrderUseCase } from "../../../domain/useCases/Order/CreateOrder/CreateOrderUseCase";

export class CreateOrderController extends Controller{
  constructor(
    private useCase: CreateOrderUseCase
  ){ super() }

  async handle(request: Request, response: Response){
    try {
      const {
        id,
        name,
        queue_id,
        status
      } = request.body;

      const data = await this.useCase.execute({
        id,
        name,
        queue_id,
        status
      });

      return response.status(200).json({
        result: true,
        response: "Pedido criado com sucesso",
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