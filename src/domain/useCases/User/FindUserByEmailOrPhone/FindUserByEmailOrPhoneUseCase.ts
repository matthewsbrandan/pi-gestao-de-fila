import { IUserRepository, UserInstanceOptions } from "../../../repositories/IUserRepository";

interface DTO{
  search: string,
  type: 'email' | 'phone'
  options?: UserInstanceOptions
}
export class FindUserByEmailOrPhoneUseCase{
  constructor(
    private userRepo: IUserRepository
  ){}

  async execute({ search, type, options }: DTO){
    const user = await this.userRepo.findUserByEmailOrPhone({ search, type }, options)
    return user
  }
}