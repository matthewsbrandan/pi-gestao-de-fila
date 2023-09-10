import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';

import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { delay } from './utils';

const users : User[] = [
  { id: uuid(), name: 'Mateus', email: 'mateusfleria@gmail.com', password: bcrypt('queue@1234') }
]

export class UserRepository implements IUserRepository{
  _instance(response: any){
    return new User(response, response.id ?? undefined)
  }
  async findUserByEmail(email: string): Promise<User> {
    await delay()

    const findedUser = users.find((user) => user.email === email)

    if(!findedUser) throw new Error(
      'Usuário não encontrado'
    )

    return this._instance(findedUser)
  }

}