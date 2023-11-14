import { Request, Response } from "express";
import { Controller } from "../Controller";
import { DeviceUseCase } from "../../../domain/useCases/WebView/Device/DeviceUseCase";
import { route } from "../../../infra/routes/routenames";

export class DeviceController extends Controller{
  constructor(
    private useCase: DeviceUseCase
  ){ super() }

  async handle(request: Request, response: Response){
    try {
      this.init(request, response);

      const data = await this.useCase.execute();

      return this.view('device/index.ejs', {
        data,
        headerOptions: {
          import: {
            css: ['modal.css']
          }
        }
      })
    } catch (error) {
      console.error('[DeviceController]',error)

      this.notify('error', error.message)
      return response.redirect(route.home())
    }
  }
}