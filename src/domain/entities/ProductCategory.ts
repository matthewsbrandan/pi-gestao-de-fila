import { Product } from "./Product"

export class ProductCategory{
  public readonly id : number
  public name : string
  public description? : string
  public picture?: string
  public products?: Product[]

  constructor(props: Omit<ProductCategory, 'id'>, id?: number){
    Object.assign(this, props)
    if(id) this.id = id
  }
}