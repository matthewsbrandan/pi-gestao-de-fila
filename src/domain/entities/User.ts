import { v4 as uuid } from 'uuid';

export class User{
  public readonly id : string = uuid()
  public name : string
  public email : string
  public password : string

  constructor(props : Omit<User, 'id'>, id?: string){
    Object.assign(this, props)

    if(id) this.id = id
  }
}