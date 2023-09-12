import { IUserRepository } from "../../../repositories/IUserRepository";

export class FindUserByIdUseCase{
  constructor(
    private userRepo: IUserRepository
  ){}

  async execute(id: number){
    const user = await this.userRepo.findUserById(id)
    return user;
  }
}