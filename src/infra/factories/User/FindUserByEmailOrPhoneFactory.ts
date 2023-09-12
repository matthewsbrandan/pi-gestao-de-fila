import { FindUserByEmailOrPhoneController } from "../../../application/controllers/User/FindUserByEmailOrPhoneController";
import { FindUserByEmailOrPhoneUseCase } from "../../../domain/useCases/User/FindUserByEmailOrPhone/FindUserByEmailOrPhoneUseCase";
import { UserRepository } from "../../repositories/in-prisma/UserRepository"

export const FindUserByEmailOrPhoneFactory = () => {
  const userRepo = new UserRepository();

  const useCase = new FindUserByEmailOrPhoneUseCase(
    userRepo
  );

  const controller = new FindUserByEmailOrPhoneController(useCase);

  return { controller, useCase };
}