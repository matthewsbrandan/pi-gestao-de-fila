export class Device{
  public id : number
  public name: string
  public is_active: boolean

  constructor(props: Device){
    Object.assign(this, props)
  }
}