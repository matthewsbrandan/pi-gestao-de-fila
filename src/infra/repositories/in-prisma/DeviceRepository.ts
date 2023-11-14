import { response } from "express";
import { Device } from "../../../domain/entities/Device";
import { IDeviceRepository } from "../../../domain/repositories/IDeviceRepository";
import db from "../../config/prisma";

export class DeviceRepository implements IDeviceRepository{
  private _instance(response: any){
    return new Device({
      id: response.id,
      is_active: response.is_active,
      name: response.name
    })
  }
  async findAllActiveDevices(): Promise<Device[]> {
    const responses = await db.device.findMany({
      where: { is_active: true }
    })
    
    if(!response) return [];

    return responses.map(response => this._instance(response))
  }

  async findDeviceById(device_id: number): Promise<Device> {
    const response = await db.device.findUnique({
      where: { id: device_id }
    })

    if(!response) throw new Error(
      'Dispositivo não encontrado'
    )

    return this._instance(response)
  }
  async create(device: Omit<Device, "id">): Promise<Device> {
    const response = await db.device.create({
      data: device
    })

    return this._instance(response)
  }
  async findAll(): Promise<Device[]> {
    const responses = await db.device.findMany()
    
    if(!response) return [];

    return responses.map(response => this._instance(response))   
  }
}