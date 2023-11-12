import { Request, Response } from "express";
import { FindStartedQueueUseCase } from "../../../domain/useCases/Queue/FindStartedQueue/FindStartedQueueUseCase";
import { Controller } from "../Controller";
import { route } from "../../../infra/routes/routenames";
import { ProductsInCategoriesUseCase } from "../../../domain/useCases/WebView/Product/ProductsInCategoriesUseCase";
import { IDeviceRepository } from "../../../domain/repositories/IDeviceRepository";

export class QueueManageController extends Controller{
  constructor(
    private findStartedQueue: FindStartedQueueUseCase,
    private productsUseCase: ProductsInCategoriesUseCase,
    private deviceRepo: IDeviceRepository
  ){ super() }

  async handle(request: Request, response: Response){
    this.init(request, response)

    try {
      if(!this.auth_user) return this.redirectWithMessage(route.home(), 'error', 'Você deve estar autenticado para acessar essa tela')

      const queue = await this.findStartedQueue.execute()
      if(!queue) return this.view('error.ejs', {
        error: {
          title: 'Indisponível',
          message: 'Não existe nenhuma fila de atendimento iniciada',
        }
      })

      const devices = await this.deviceRepo.findAllActiveDevices()

      const productCategories = await this.productsUseCase.execute()

      return this.view('manage-queue.ejs', {
        headerOptions: { import: { css: ['drag-and-drop.css','modal.css'] } },
        data: {
          queue,
          devices,
          productCategories,
          is_management: true
        } 
      })
    } catch (error) {
      this.notify('error', error.message)
      return response.redirect(route.home())
    }
  }
}