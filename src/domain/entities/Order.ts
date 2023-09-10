import { v4 as uuid } from 'uuid';

export type OrderStatus = 'to-do' | 'pending' | 'finished'
export class Order{
  public readonly id : string = uuid()
  public name : string
  public status : OrderStatus = 'to-do'
  public queue_id: string

  constructor(props: Omit<Order, 'id'>, id?: string){
    Object.assign(this, props)
    if(id) this.id = id
  }
}