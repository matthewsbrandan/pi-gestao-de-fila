import { UserRepository } from "./in-prisma/UserRepository"
import bcrypt from 'bcrypt';

export async function seeds() {
  const userRepo = new UserRepository();
  const findedUser = await userRepo.findUserByEmailOrPhone({
    search: 'admin@univesp.br',
    type: 'email'
  })

  if(!findedUser) userRepo.createUser({
    email: 'admin@univesp.br',
    name: 'Administrador',
    type: 'manager',
    password: await bcrypt.hash('univesp1234', 10)
  })
}