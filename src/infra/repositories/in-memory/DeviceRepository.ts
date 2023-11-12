import { Device } from "../../../domain/entities/Device";
import { IDeviceRepository } from "../../../domain/repositories/IDeviceRepository";

const devices : Device[] = [
  new Device({ id: 1, name: 'Dispositivo #1', is_active: true }),
  new Device({ id: 2, name: 'Dispositivo #2', is_active: true }),
  new Device({ id: 3, name: 'Dispositivo #3', is_active: true }),
  new Device({ id: 4, name: 'Dispositivo #4', is_active: false }),
]
export class DeviceRepository implements IDeviceRepository{
  async findAllActiveDevices(): Promise<Device[]> {
    return devices.filter(dev => !!dev.is_active)
  }
  async findDeviceById(device_id: number): Promise<Device> {
    const findedDevice = devices.find((device) => device.id === device_id)

    if(!findedDevice) throw new Error(
      'Dispositivo não encontrado'
    )

    return findedDevice
  }
}