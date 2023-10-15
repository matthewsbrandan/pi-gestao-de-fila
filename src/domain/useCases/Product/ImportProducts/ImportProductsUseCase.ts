import XLSX from 'xlsx';
import { Product } from '../../../entities/Product';
import { IProductCategoryRepository } from '../../../repositories/IProductCategoryRepository';
import { IProductRepository } from '../../../repositories/IProductRepository';

interface ParsedProduct extends Omit<Product, 'id' | 'category_id'> {
  category: string
}

export class ImportProductsUseCase{
  private expectedColumns = [
    {
      id: 'name',
      name: 'nome',
      type: 'text',
      required: true 
    },{
      id: 'description',
      name: 'descricao',
      type: 'text',
      required: true
    },{
      id: 'category',
      name: 'categoria',
      type: 'text',
      required: true
    },{
      id: 'price',
      name: 'preco',
      type: 'money',
      required: true
    },{
      id: 'picture',
      name: 'imagem',
      type: 'text',
      required: false
    },{
      id: 'sku',
      name: 'sku',
      type: 'text',
      required: false
    }      
  ]

  constructor(
    private categoryRepo: IProductCategoryRepository,
    private productRepo: IProductRepository
  ){}

  async execute({ file }:{ file: any }){
    if(!file) throw new Error(
      'É obrigatório enviar um arquivo para importação'
    )

    let rows : Record<string, string>[] = [];
    try{
      const workbook = XLSX.readFile(file.path, {
        raw: true
      });
      const sheet_name_list = workbook.SheetNames;
      const sheet = workbook.Sheets[sheet_name_list[0]];
    
      rows = XLSX.utils.sheet_to_json(sheet, { header: 0 });
    }catch(e){
      console.error(e);
      throw new Error(
        'Houve um erro ao tentar ler a planilha'
      );
    }

    if(rows.length === 0) throw new Error(
      'Nenhum produto a ser importado'
    )

    const productsWithError : {
      data: Partial<ParsedProduct>,
      error: string
    }[] = []

    const parsedProducts : ParsedProduct[] = []
    const categoryNames = new Set<string>();
    rows.forEach((row) => {
      let parsed : Partial<ParsedProduct> = {}

      this.expectedColumns.forEach((expected) => {
        parsed[expected.id] = row[expected.name]

        // [ ] LIDAR COM O FORMATO DO DADO RECEBIDO
        // [ ] VALIDAR SE O VALOR PREENCHIDO ATENDE AOS REQUISITOS
      })
      // [ ] CASO NÃO ATENDA, ADD EM PRODUCTSWITHERROR COM A DEVIDA MENSAGEM DE ERRO

      if(parsed.category) categoryNames.add(parsed.category)
      parsedProducts.push(parsed as ParsedProduct)
    })

    // LIDAR COM CATEGORIAS ====================
    const categories = await this.categoryRepo.findByNames([...categoryNames]);
    const newCategoryNames = [...categoryNames].filter((name) => !categories.find((category) => category.name === name))
    if(newCategoryNames.length > 0){
      const newCategories = await this.categoryRepo.createManyCategories(newCategoryNames.map((name) => ({
        name
      })))

      categories.push(...newCategories)
    }

    const newProducts = parsedProducts.map<Omit<Product, 'id'>>((product) => {
      const findedCategory = categories.find((category) => category.name === product.category)      
      // [ ] LIDAR COM A POSSIBILIDADE DE NÃO ENCONTRAR UMA CATEGORIA PREENCHENDO PRODUCTSWITHERROR
      if(!findedCategory) throw new Error(
        `Não foi possível identificar a categoria do produto ${product.name}`
      )

      delete product.category
      return {
        ...product,
        category_id: findedCategory.id
      }
    })
    
    // [ ] CRIAR OU ATUALIZAR PRODUTOS, COM UPSERT BY NAME
    //     [ ] NÃO FAZER O REPLACE DE CAMPOS EM BRANCO
    const createdProducts = await this.productRepo.createManyProducts(newProducts)

    return [createdProducts,  productsWithError]
  }
}