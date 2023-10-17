import { Request, Response } from "express";
import { Controller } from "../Controller";
import { DashboardUseCase } from "../../../domain/useCases/WebView/Dashboard/DashboardUseCase";

export class DashboardController extends Controller{
  constructor(
    private useCase: DashboardUseCase
  ){ super() }

  async handle(request: Request, response: Response){
    try {
      this.init(request, response);
      
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