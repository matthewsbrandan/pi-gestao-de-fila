import { Request, Response } from "express";
import { Controller, HeaderOptionsType } from "../Controller";
import { ProductsInCategoriesUseCase } from "../../../domain/useCases/WebView/Product/ProductsInCategoriesUseCase";
import { route } from "../../../infra/routes/routenames";

export class ProductController extends Controller{
  constructor(
    private useCase: ProductsInCategoriesUseCase
  ){ super() }

  async handle(request: Request, response: Response){
    this.init(request, response)

    try {
      const headerOptions : HeaderOptionsType = { import: { css: ['modal.css'] } }

      if(!this.auth_user) throw new Error('Você não está autenticado')

      if(this.auth_user.type === 'client') return response.redirect(route.home())

      const productCategories = await this.useCase.execute()

      return this.view('products/index.ejs', { headerOptions, data: {
        productCategories
      }})
    } catch (error) {
      this.notify('error', error.message)
      return response.redirect(route.home())
    }
  }
}