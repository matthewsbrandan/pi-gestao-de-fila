import { Request, Response } from "express";
import { FindUserByIdUseCase } from "../../../domain/useCases/User/FindUserById/FindUserByIdUseCase";

export class FindUserByIdController{
  constructor(
    private useCase: FindUserByIdUseCase
  ){}

  async handle(request: Request, response: Response){
    try {
      const { id } = request.params;
      const data = await this.useCase.execute(Number(id));

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