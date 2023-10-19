import { IProductCategoryRepository } from "../../../repositories/IProductCategoryRepository";
import { IProductRepository } from "../../../repositories/IProductRepository";

export class ProductsInCategoriesUseCase{
  constructor(
    private categoryRepo : IProductCategoryRepository,
    private productRepo : IProductRepository
  ){}

  async execute(){
    let categories = await this.categoryRepo.findAll()
    const products = await this.productRepo.findAll()

    categories = categories.map((category) => ({
      ...category,
      products: products.filter((product) => product.category_id === category.id)
    }))
  
    return categories
  }
}