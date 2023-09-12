import { User } from "../../../domain/entities/User";
import { FindUserByEmailOrPhoneProps, IUserRepository, UserInstanceOptions } from "../../../domain/repositories/IUserRepository";
import db from "../../config/prisma";

export class UserRepository implements IUserRepository{
  _instance(response: any, options?: UserInstanceOptions){
    const user = new User(response, response.id ?? undefined)
    if(!options || !options.include.includes('password')) delete user.password
    
    return user
  }
  async findUserByEmailOrPhone({ search, type }: FindUserByEmailOrPhoneProps, options?: UserInstanceOptions): Promise<User | undefined> {
    if(!['email','phone'].includes(type)) throw new Error(
      'Tipo de pesquisa inválida. Os tipos aceitos são email e telefone'
    )
    
    const user = await db.user.findUnique({
      where: type === 'email' ? { email: search } : { phone: search },
    });

    if(!user) return;
    
    return this._instance(user, options)
  }
  async findUserById(id: number, options?: UserInstanceOptions) : Promise<User> {
    const user = await db.user.findUnique({
      where: { id }
    })

    if(!user) throw new Error('Usuário não encontrado')

    return this._instance(user, options)
  }
  async createUser(user: User, options?: UserInstanceOptions): Promise<User> {
    if(user.email){
      if(!!await this.findUserByEmailOrPhone({
        search: user.email,
        type: 'email'
      })) throw new Error(
        'Este email já está sendo utilizado'
      )  
    }
    if(user.phone){
      if(!!await this.findUserByEmailOrPhone({
        search: user.phone,
        type: 'phone'
      })) throw new Error(
        'Este telefone já está sendo utilizado'
      )
    }

    const userCreated = await db.user.create({
      data: user
    })

    return this._instance(userCreated, options)
  }
}