import { Request, Response } from "express";
import { Controller } from "../Controller";
import { FindOrderByDeviceIdUseCase } from "../../../domain/useCases/Order/FindOrderByDeviceId/FindOrderByDeviceIdUseCase";

export class FindOrderByDeviceIdController extends Controller{
  constructor(
    private useCase: FindOrderByDeviceIdUseCase
  ){ super() }

  async handle(request: Request, response: Response){
    try {
      const { id } = request.params;

      const data = await this.useCase.execute({ device_id: Number(id) });

      return response.status(200).json({
        result: true,
        response: "Pedido encontrado com sucesso",
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