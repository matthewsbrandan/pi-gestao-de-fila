export class OrderItem{
  public id         : number
  public product_id : number
  public quantity   : number
  public unit_price : number

  constructor(props: Omit<OrderItem, 'id'>, id?: number){
    Object.assign(this, props)
    if(id) this.id = id
  }
}