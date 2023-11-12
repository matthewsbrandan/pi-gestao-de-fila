import { Order } from "./Order"
import { Product } from "./Product"

export class OrderItem{
  public id         : number
  public product_id : number
  public quantity   : number
  public unit_price : number
  public order_id : number

  public product? : Product
  public order?   : Order

  constructor(props: Omit<OrderItem, 'id'>, id?: number){
    Object.assign(this, props)
    if(id) this.id = id
  }
}