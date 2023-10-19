import { Product } from "../entities/Product"

export interface IProductRepository{
  createManyProducts(products: Omit<Product, 'id'>[]) : Promise<Product[]>
  findAll() : Promise<Product[]>
}