export type OrderStatus = 'to-do' | 'pending' | 'finished'
export class Order{
  public readonly id : number
  public name : string
  public status : OrderStatus = 'to-do'
  public queue_id: string

  constructor(props: Omit<Order, 'id'>, id?: number){
    Object.assign(this, props)
    if(id) this.id = id
  }
}