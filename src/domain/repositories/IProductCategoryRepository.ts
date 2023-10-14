import { ProductCategory } from "../entities/ProductCategory";

export interface IProductCategoryRepository{
  createManyCategories(categories: Omit<ProductCategory, 'id'>[]) : Promise<ProductCategory[]>
  findAll() : Promise<ProductCategory[]>
}