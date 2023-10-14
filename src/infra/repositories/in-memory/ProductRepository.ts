import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { Product } from "../../../domain/entities/Product";
import { ProductCategory } from "../../../domain/entities/ProductCategory";
import { categories } from "./ProductCategoryRepository";


const products : Product[] = [
  new Product({
    category_id: 1,
    name: 'X-Burger',
    description: 'Pão, Carne, Queijo',
    price: 15,
  }, 1),
  new Product({
    category_id: 1,
    name: 'X-Salada',
    description: 'Pão, Carne, Queijo, Alface, Tomate',
    price: 17,
  }, 2),
  new Product({
    category_id: 1,
    name: 'X-Bacon',
    description: 'Pão, Carne, Queijo, Bacon',
    price: 20
  }, 3),
  new Product({
    category_id: 2,
    name: 'Coca-Cola',
    description: '500ml',
    price: 6
  }, 4),
  new Product({
    category_id: 2,
    name: 'Suco de Laranja',
    description: '500ml',
    price: 8
  })
]
export class ProductRepository implements IProductRepository{
  async createManyProducts(newProducts: Omit<Product, 'id'>[]) : Promise<Product[]> {
    const category_ids = newProducts.map((product) => product.category_id);

    if(!category_ids.every(
      (category_id) => categories.find((cat) => cat.id === category_id)
    )) throw new Error(
      'Categoria inválida'
    )

    const nextId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
    const createdProducts = newProducts.map((product, index) => ({
      id: nextId + index,
      ...product
    }))

    products.push(...createdProducts)

    return createdProducts
  }
  async findAll(): Promise<Product[]> {
    return products
  }
}