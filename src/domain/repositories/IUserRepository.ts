import { User } from "../entities/User";

export interface UserInstanceOptions{ include: Array<'password'> }
export interface FindUserByEmailOrPhoneProps{
  search: string,
  type: 'email' | 'phone'
}
export interface IUserRepository{
  findUserByEmailOrPhone(props: FindUserByEmailOrPhoneProps, options?: UserInstanceOptions) : Promise<User | undefined>
  findUserById(id: number, options?: UserInstanceOptions) : Promise<User>
  createUser(user: Omit<User, 'id'>, options?: UserInstanceOptions) : Promise<User>
}