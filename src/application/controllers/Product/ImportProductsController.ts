import multiparty from "multiparty";
import { Request, Response } from "express";
import { Controller } from "../Controller";
import { ImportProductsUseCase } from "../../../domain/useCases/Product/ImportProducts/ImportProductsUseCase";
import { route } from "../../../infra/routes/routenames";

export class ImportProductsController extends Controller{
  constructor(
    private useCase: ImportProductsUseCase
  ){ super() }

  async handle(request: Request, response: Response){
    this.init(request, response)
    try {
      if(!this.auth_user || this.auth_user.type !== 'manager') return this.view('error.ejs', {
        error: {
          title: 'Não autorizado',
          message: 'Você não tem permissão de acessar essa página'
        }
      })

      const form = new multiparty.Form();
      form.parse(request, async (err, fields, files) => {

        if(!files.file || files.file.length === 0) return this.redirectWithMessage(
          route.products.home(), 
          'error',
          'Selecione um arquivo para importar'
        )

        const [createdProducts, productsWithError] = await this.useCase.execute({
          file: files.file[0]
        });  

        // [ ] LIDAR COM A POSSÍVEL EXISTÊNCIA DE PRODUCTS WITH ERROR

        return this.redirectWithMessage(
          route.products.home(), 
          createdProducts.length === 0 ? 'info' : 'success', (
            createdProducts.length === 0 ? 'Nenhum produto importado' : 
            createdProducts.length === 1 ? '1 Produto importado com sucesso' :
            `${createdProducts.length} produtos importados com sucesso`
          )
        )
      })
    } catch (error) {
      return this.view('error.ejs', {
        error: {
          title: 'Lidar com Importação',
          message: error.message ?? 'Não foi possível lidar com a importação dos produtos'
        }
      })
    }
  }
}