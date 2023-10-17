import { Request, Response } from "express";
import { FindStartedQueueUseCase } from "../../../domain/useCases/Queue/FindStartedQueue/FindStartedQueueUseCase";
import { Controller } from "../Controller";
import { route } from "../../../infra/routes/routenames";
import { ProductsInCategoriesUseCase } from "../../../domain/useCases/WebView/Product/ProductsInCategoriesUseCase";

export class QueueManageController extends Controller{
  constructor(
    private findStartedQueue: FindStartedQueueUseCase,
    private productsUseCase: ProductsInCategoriesUseCase
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

      const productCategories = await this.productsUseCase.execute()

      return this.view('manage-queue.ejs', {
        headerOptions: { import: { css: ['drag-and-drop.css','modal.css'] } },
        data: {
          queue,
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