import { Device } from "../entities/Device"

export interface IDeviceRepository{
  create(device: Omit<Device, 'id'>) : Promise<Device>
  findAll() : Promise<Device[]>
  findAllActiveDevices() : Promise<Device[]>
  findDeviceById(device_id: number) : Promise<Device>
}