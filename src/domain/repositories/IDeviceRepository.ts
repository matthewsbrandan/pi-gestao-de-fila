import { Device } from "../entities/Device"

export interface IDeviceRepository{
  findAllActiveDevices() : Promise<Device[]>
  findDeviceById(device_id: number) : Promise<Device>
}