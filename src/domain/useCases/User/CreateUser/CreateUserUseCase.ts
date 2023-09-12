import { IUserRepository } from "../../../repositories/IUserRepository";
import bcrypt from 'bcrypt';

interface DTO{
  name : string
  email? : string
  phone? : string
  password : string
  type : 'manager' | 'client'
}
export class CreateUserUseCase{
  constructor(
    private userRepo: IUserRepository
  ){}

  async execute({ name, email, phone, password, type = 'client' } : DTO){
    if(!name || !password) throw new Error(
      'Os campos nome, senha'
    )

    if(!['manager', 'client'].includes(type)) throw new Error(
      'Tipo de usuário inválido'
    )

    if(!email && !phone) throw new Error(
      'É obrigatório informar o email ou telefone'
    )
    
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await this.userRepo.createUser({
      name, email, phone, type,
      password: hashedPassword
    })

    return user
  }
}