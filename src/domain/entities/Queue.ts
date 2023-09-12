import { Order } from './Order';

export class Queue{
  public readonly id : number
  public is_autoincrement : boolean = true
  public start_in? : number = 100
  public max_length? : number
  public is_open : boolean = true
  public started_at : Date = new Date()
  public ended_at? : Date
  public orders: Order[] = []
  public user_id : number

  constructor(props: Omit<Queue, 'id'>, id?: number){
    Object.assign(this, props)
    if(id) this.id = id
  }
}