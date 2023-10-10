import { Request, Response } from "express";
import { User } from "../../domain/entities/User";

export interface HeaderOptionsType{
  import?: {
    css?: ('modal.css' | 'drag-and-drop.css')[]
  }
}
export class Controller{
  protected request : Request
  protected response : Response
  protected auth_user: User

  private verifyIfIsInitialized(){
    if(!this.request || !this.response) throw new Error(
      'Initialize req and res on your controller'
    )
  }

  init(request: Request, response: Response){
    this.request = request
    this.response = response
    this.auth_user = this.request.user as User
  }
  
  view(name: string, props?:{
    headerOptions?: HeaderOptionsType,
    error?: {
      title?: string,
      message?: string,
      /** default: true */
      goBack?: boolean
    },
    data?: Record<string, any>
  }){
    this.verifyIfIsInitialized()

    const {
      headerOptions = { },
      error = {},
      data = {}
    } = props ?? {}

    if(error.goBack === undefined) error.goBack = true

    return this.response.render(name, {
      data,
      error,
      headerOptions,
      auth_user: this.auth_user,
    })
  }

  notify(type: 'error' | 'success' | 'info', message: string){
    this.verifyIfIsInitialized()

    this.request.flash('message', `${type}: ${message}`);
  }
}