import { CreateDeviceController } from "../../../application/controllers/Device/CreateDeviceController";
import { CreateDeviceUseCase } from "../../../domain/useCases/Device/CreateDevice/CreateDeviceUseCase";
import { DeviceRepository } from "../../repositories/in-prisma/DeviceRepository";

export const CreateDeviceFactory = () => {
  const deviceRepo = new DeviceRepository();

  const useCase = new CreateDeviceUseCase(deviceRepo);

  const controller = new CreateDeviceController(useCase);

  return controller;
}