import { Device } from "@prisma/client"
import { Queue } from "./Queue"
import { User } from "./User"

export type OrderStatus = 'pending' | 'finished' | 'withdrawn'
export class Order{
  public readonly id : number
  public name : string
  public total_price: number
  public status : OrderStatus = 'pending'
  
  public user_id: number
  public queue_id: number
  public device_id: number

  public created_at?: Date
  public created_at_formatted?: string

  public updated_at?: Date

  public user?: User
  public queue: Queue
  public device: Device
  
  constructor(props: Omit<Order, 'id'>, id?: number){
    Object.assign(this, props)
    if(id) this.id = id
    if(this.created_at){
      this.created_at_formatted = `${
        this.created_at.getFullYear()
      }-${
        this.created_at.getMonth() + 1
      }-${
        this.created_at.getDate()
      } ${
        this.created_at.getHours()
      }:${
        this.created_at.getMinutes()
      }`
    }
  }
}