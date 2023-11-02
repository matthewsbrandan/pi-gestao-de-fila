export type OrderStatus = 'pending' | 'finished' | 'withdrawn'
export class Order{
  public readonly id : number
  public name : string
  public total_price: number
  public status : OrderStatus = 'pending'
  public user_id: number
  public queue_id: number
  public device_id?: number

  constructor(props: Omit<Order, 'id'>, id?: number){
    Object.assign(this, props)
    if(id) this.id = id
  }
}