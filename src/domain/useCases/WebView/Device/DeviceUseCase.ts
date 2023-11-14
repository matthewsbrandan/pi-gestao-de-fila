import { IDeviceRepository } from "../../../repositories/IDeviceRepository"

export class DeviceUseCase{
  constructor(
    private deviceRepo: IDeviceRepository
  ){}

  async execute(){
    const devices = await this.deviceRepo.findAll()

    return { devices }
  }
}