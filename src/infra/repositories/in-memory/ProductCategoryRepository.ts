import { ProductCategory } from "../../../domain/entities/ProductCategory";
import { IProductCategoryRepository } from "../../../domain/repositories/IProductCategoryRepository";

export const categories = [
  new ProductCategory({
    name: 'Lanches',
    description: 'Variedades de Hamburguers'
  }, 1),
  new ProductCategory({
    name: 'Bebidas',
    description: 'Refrigerantes e Sucos Naturais'
  }, 2)
]

export class ProductCategoryRepository implements IProductCategoryRepository{
  async createManyCategories(newCategories: Omit<ProductCategory, "id">[]): Promise<ProductCategory[]> {
    const nextId = categories.length > 0 ? categories[categories.length - 1].id + 1: 1
    const createdCategories = newCategories.map((category, index) => new ProductCategory({
      ...category
    }, nextId + index))

    categories.push(...createdCategories)
    
    return createdCategories
  }
  async findAll(): Promise<ProductCategory[]> {
    return categories
  }
  async findByNames(names: string[]): Promise<ProductCategory[]> {
    return categories.filter(category => names.includes(category.name))
  }
}