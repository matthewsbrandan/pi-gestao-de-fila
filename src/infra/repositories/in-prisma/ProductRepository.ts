import { Product } from "../../../domain/entities/Product";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import db from "../../config/prisma";

export class ProductRepository implements IProductRepository{
  _instance = (response: any) => new Product({
    category_id: response.category_id,
    description: response.description,
    name: response.name,
    price: response.price,
    picture: response.picture,
    sku: response.sku,
  }, response.id)
  async createManyProducts(products: Omit<Product, "id">[]): Promise<Product[]> {
    const createdProducts : Product[] = []
    for(const product of products){
      const data = {
        description: product.description,
        name: product.name,
        price: product.price,
        category_id: product.category_id,
        picture: product.picture,
        sku: product.sku
      }

      const existentProduct = await this.findByName(product.name)
      let response : any = null;
      if(existentProduct) response = await db.product.update({
        where: { id: existentProduct.id },
        data
      })
      else response = await db.product.create({
        data
      })

      if(!response) throw new Error(
        `Não foi possível criar o produto ${product.name}`
      )

      createdProducts.push(this._instance(response))
    }

    return createdProducts;
  }
  async findByName(name: string) : Promise<Product | undefined>{
    const response = await db.product.findFirst({ where: { name } })
    if(!response) return;

    return this._instance(response);
  }
  async findAll(): Promise<Product[]> {
    const responses = await db.product.findMany()

    return responses.map((product) => this._instance(product))
  }
}