import { Request, Response } from "express";
import { Controller } from "../Controller";
import { CreateDeviceUseCase } from "../../../domain/useCases/Device/CreateDevice/CreateDeviceUseCase";
import { route } from "../../../infra/routes/routenames";

export class CreateDeviceController extends Controller{
  constructor(
    private useCase: CreateDeviceUseCase
  ){ super() }

  async handle(request: Request, response: Response){
    this.init(request, response)
    try {
      const { name } = request.body;

      await this.useCase.execute({
        name,
        is_active: true
      });

      return this.redirectWithMessage(
        route.device.home(),
        'success',
        'Dispositivo criado com sucesso'
      )
    } catch (error) {
      console.error('[CreateDeviceController]', { error })

      return this.redirectWithMessage(
        route.device.home(),
        'error',
        'Não foi possível criar esse dispositivo'
      )
    }
  }
}