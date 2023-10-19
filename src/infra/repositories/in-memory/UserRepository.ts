import bcrypt from 'bcrypt';

import { User } from "../../../domain/entities/User";
import { FindUserByEmailOrPhoneProps, IUserRepository, UserInstanceOptions } from "../../../domain/repositories/IUserRepository";
import { delay } from './utils';

const users : User[] = [];

(async () => users.push({
  id: 1,
  name: 'Mateus',
  email: 'mateusfleria@gmail.com',
  password: await bcrypt.hash('queue@1234', 10),
  type: 'manager'
}))()

export class UserRepository implements IUserRepository{
  _instance(response: any, options?: UserInstanceOptions){
    const user = new User(response, response.id ?? undefined)
    if(!options || !options.include.includes('password')) delete user.password

    return user
  }
  async findUserByEmailOrPhone({ search, type }: FindUserByEmailOrPhoneProps, options?: UserInstanceOptions): Promise<User | undefined> {
    await delay()

    if(!['email','phone'].includes(type)) throw new Error(
      'Tipo de pesquisa inválida. Os tipos aceitos são email e telefone'
    )

    const findedUser = users.find((user) => user[type] === search)

    if(!findedUser) return;

    return this._instance(findedUser, options)
  }
  async findUserById(id: number, options?: UserInstanceOptions) {
    await delay()

    const findedUser = users.find((user) => user.id === id)

    if(!findedUser) throw new Error(
      'Usuário não encontrado'
    )

    return this._instance(findedUser, options)
  }
  async createUser(user: Omit<User, 'id'>, options?: UserInstanceOptions): Promise<User> {
    await delay()

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

    users.push({
      id: users[users.length - 1].id + 1,
      ...user
    });

    return this._instance(user, options)
  }
}