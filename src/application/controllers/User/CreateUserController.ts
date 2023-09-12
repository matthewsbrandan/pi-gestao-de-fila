import { Request, Response } from "express";
import { CreateUserUseCase } from "../../../domain/useCases/User/CreateUser/CreateUserUseCase";

export class CreateUserController{
  constructor(
    private useCase: CreateUserUseCase
  ){}

  async handle(request: Request, response: Response){
    try {
      const { name, email, phone, password, type } = request.body;
      const data = await this.useCase.execute({
        name,
        email,
        phone,
        password,
        type
      });

      return response.status(200).json({
        result: true,
        response: "Usuário criado com sucesso",
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