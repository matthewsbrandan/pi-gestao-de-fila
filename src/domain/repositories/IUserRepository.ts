import { User } from "../entities/User";

export interface IUserRepository{
  findUserByEmail(email: string) : Promise<User>
}