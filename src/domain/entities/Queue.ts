import { Order } from './Order';

export class Queue{
  public readonly id : number
  public is_autoincrement : boolean = true
  public start_in? : number = 100
  public max_length? : number
  public is_open : boolean = true
  public started_at : Date = new Date()
  public started_at_formatted? : string
  public ended_at? : Date
  public ended_at_formatted? : string
  public orders: Order[] = []
  public user_id : number

  constructor(props: Omit<Queue, 'id'>, id?: number){
    Object.assign(this, props)
    if(id) this.id = id
    
    if(this.started_at) this.started_at_formatted = this.formatDate(this.started_at)
    if(this.ended_at) this.ended_at_formatted = this.formatDate(this.ended_at)
  }

  formatDate(date){
    return `${
      date.getFullYear()
    }-${
      date.getMonth() + 1
    }-${
      date.getDate()
    } ${
      date.getHours()
    }:${
      date.getMinutes()
    }`
  }
}