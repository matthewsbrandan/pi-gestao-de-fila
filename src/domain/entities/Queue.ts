import { v4 as uuid } from 'uuid';
import { Order } from './Order';

export class Queue{
  public readonly id : string = uuid()
  public is_autoincrement : boolean = true
  public start_in? : number = 100
  public max_length? : number
  public is_open : boolean = true
  public started_at : Date = new Date()
  public ended_at? : Date
  public orders: Order[] = []
  public user_id : string

  constructor(props: Omit<Queue, 'id'>, id?: string){
    Object.assign(this, props)
    if(id) this.id = id
  }
}