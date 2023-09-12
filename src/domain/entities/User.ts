export class User{
  public readonly id : number
  public name : string
  public email? : string
  public phone? : string
  public password : string
  public type : 'manager' | 'client'

  constructor(props : Omit<User, 'id'>, id?: number){
    Object.assign(this, props)

    if(id) this.id = id
  }
}