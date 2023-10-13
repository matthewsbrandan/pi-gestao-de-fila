import { Request, Response } from "express";
import { Controller, HeaderOptionsType } from "../Controller";
import { ProductUseCase } from "../../../domain/useCases/WebView/Product/ProductUseCase";
import { route } from "../../../infra/routes/routenames";
import { FindStartedQueueUseCase } from "../../../domain/useCases/Queue/FindStartedQueue/FindStartedQueueUseCase";

export class ProductController extends Controller{
  constructor(
    private useCase: ProductUseCase
  ){ super() }

  async handle(request: Request, response: Response){
    this.init(request, response)

    try {
      const headerOptions : HeaderOptionsType = { import: { css: ['modal.css'] } }

      if(!this.auth_user) throw new Error('Você não está autenticado')

      if(this.auth_user.type === 'client') return response.redirect(route.home())

      const products = await this.useCase.execute()

      return this.view('products/index.ejs', { headerOptions, data: {
        products
      }})
    } catch (error) {
      this.notify('error', error.message)
      return response.redirect(route.home())
    }
  }
}