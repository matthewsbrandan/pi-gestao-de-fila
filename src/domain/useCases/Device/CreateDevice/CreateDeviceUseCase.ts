import { Device } from "../../../entities/Device";
import { IDeviceRepository } from "../../../repositories/IDeviceRepository";

export class CreateDeviceUseCase{
  constructor(
    private deviceRepo: IDeviceRepository
  ){}

  async execute(device: Omit<Device, 'id'>){
    const createdDevice = await this.deviceRepo.create(device)

    return createdDevice
  }
}