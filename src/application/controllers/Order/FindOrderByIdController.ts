import { Request, Response } from "express";
import { FindOrderByIdUseCase } from "../../../domain/useCases/Order/FindOrderById/FindOrderByIdUseCase";

export class FindOrderByIdController{
  constructor(
    private useCase: FindOrderByIdUseCase
  ){ }

  async handle(request: Request, response: Response){
    try {
      const { id } = request.params;

      const data = await this.useCase.execute({ order_id: Number(id) });

      return response.status(200).json({
        result: true,
        response: "Pedido encontrado",
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