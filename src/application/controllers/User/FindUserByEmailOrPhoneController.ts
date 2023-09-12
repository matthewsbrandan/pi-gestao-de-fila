import { Request, Response } from "express";
import { FindUserByEmailOrPhoneUseCase } from "../../../domain/useCases/User/FindUserByEmailOrPhone/FindUserByEmailOrPhoneUseCase";

export class FindUserByEmailOrPhoneController{
  constructor(
    private useCase: FindUserByEmailOrPhoneUseCase
  ){}

  async handle(request: Request, response: Response){
    try {
      const data = await this.useCase.execute();

      return response.status(200).json({
        result: true,
        response: "Mensagem de sucesso",
        data
      })
    } catch (error) {
      return response.status(500).json({
        result: false,
        response: error.message
      })
    }
  }
}