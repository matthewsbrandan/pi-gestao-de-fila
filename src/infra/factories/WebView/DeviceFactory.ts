import { DeviceController } from "../../../application/controllers/WebView/DeviceController";
import { DeviceUseCase } from "../../../domain/useCases/WebView/Device/DeviceUseCase";
import { DeviceRepository } from "../../repositories/in-prisma/DeviceRepository";

export const DeviceFactory = () => {
  const deviceRepo = new DeviceRepository();
  const useCase = new DeviceUseCase(deviceRepo);

  const controller = new DeviceController(useCase);

  return controller;
}