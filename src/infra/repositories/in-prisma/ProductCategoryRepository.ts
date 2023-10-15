import { ProductCategory } from "../../../domain/entities/ProductCategory";
import { IProductCategoryRepository } from "../../../domain/repositories/IProductCategoryRepository";
import db from "../../config/prisma";

export class ProductCategoryRepository implements IProductCategoryRepository{
  _instance = (response: any) => new ProductCategory({
    name: response.name,
    description: response.description,
    picture: response.picture
  }, response.id)

  async createManyCategories(categories: Omit<ProductCategory, "id">[]): Promise<ProductCategory[]> {
    if(categories.length === 0) return []

    const names = categories.map(category => category.name);
    const duplicatedCategories = await this.findByNames(names)
    if(duplicatedCategories.length > 0) throw new Error(
      `Não é possível criar duas categorias com o mesmo nome: ${
        duplicatedCategories.map(cat => cat.name).join(', ')
      }`
    )

    const createdCategories : ProductCategory[] = []
    for(const category of categories){
      const response = await db.productCategory.create({
        data: {
          name: category.name,
          description: category.description,
          picture: category.picture,
        }
      })

      createdCategories.push(this._instance(response))
    }

    return createdCategories
  }
  async findAll(): Promise<ProductCategory[]> {
    const categories = await db.productCategory.findMany()

    return categories.map(category => this._instance(category))
  }
  async findByNames(names: string[]): Promise<ProductCategory[]> {
    if(names.length === 0) return [];

    const categories = await db.productCategory.findMany({
      where: { name: { in: names } }
    })

    return categories.map(category => this._instance(category))
  }
}