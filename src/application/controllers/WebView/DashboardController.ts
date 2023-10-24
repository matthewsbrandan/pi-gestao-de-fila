import { Request, Response } from "express";
import { Controller } from "../Controller";
import { DashboardUseCase } from "../../../domain/useCases/WebView/Dashboard/DashboardUseCase";
import { route } from "../../../infra/routes/routenames";

export class DashboardController extends Controller{
  constructor(
    private useCase: DashboardUseCase
  ){ super() }

  async handle(request: Request, response: Response){
    try {
      this.init(request, response);
      
      const data = await this.useCase.execute();

      return response.json({
        data
      })
      
      return this.view('dashboard/index.ejs', { data })
    } catch (error) {
      this.notify('error', error.message)
      return response.redirect(route.home())
    }
  }
}