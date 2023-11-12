import { Order } from "../../../entities/Order";
import { OrderItem } from "../../../entities/OrderItem";
import { User } from "../../../entities/User";
import { IDeviceRepository } from "../../../repositories/IDeviceRepository";
import { IOrderItemRepository } from "../../../repositories/IOrderItemRepository";
import { IOrderRepository } from "../../../repositories/IOrderRepository";
import { IQueueRepository } from "../../../repositories/IQueueRepository";
import { IUserRepository } from "../../../repositories/IUserRepository";
import bcrypt from 'bcrypt';

interface Customer{
  email: string,
  name: string,
}
interface DTO extends Omit<Order, 'id' | 'name' | 'status' | 'user_id' | 'created_at' | 'created_at_formatted' | 'updated_at' | 'user' | 'queue' | 'device' | 'items'>{
  customer: Customer,
  items: {
    id: number,
    qtd: number,
    price: number,
  }[]
}
export class CreateOrderUseCase{
  constructor(
    private orderRepo: IOrderRepository,
    private queueRepo: IQueueRepository,
    private deviceRepo: IDeviceRepository,
    private userRepo: IUserRepository,
    private orderItemRepo: IOrderItemRepository,
  ){}

  async execute(order: DTO){
    const customer = order.customer;
    const items = order.items;
    //#region VALIDATE
    if(!customer) throw new Error(
      'É obrigatório adicionar os dados do cliente'
    )

    if(!order.items || order.items.length === 0) throw new Error(
      'É obrigatório adicionar pelo menos 1 item'
    )

    const queue = await this.queueRepo.findStartedQueue()

    if(!queue || queue.id !== order.queue_id) throw new Error(
      'Esta fila não está em andamento'
    )
    //#endregion VALIDATE

    let device_id : number | undefined = undefined;
    if(order.device_id){
      const findedDevice = await this.deviceRepo.findDeviceById(Number(order.device_id))
      if(!findedDevice) throw new Error(
        'Dispositivo não encontrado'
      )

      device_id = findedDevice.id
    }

    const [user, passwordForFirstAccess] = await this.handleUser({
      customer
    })

    try{
      const createdOrder = await this.orderRepo.addOrder({
        queue_id: order.queue_id,
        name: customer.name,
        status: 'pending',
        total_price: order.total_price,
        user_id: user.id,
        device_id
      });

      const createdItems : OrderItem[] = []

      try{
        for(const item of items){
          const createdItem = await this.orderItemRepo.createOrderItem({
            product_id: item.id,
            quantity: item.qtd,
            unit_price: item.price,
            order_id: createdOrder.id
          })

          if(createdItem) createdItems.push(createdItem)
        }
      }catch(e){
        if(createdItems.length > 0) await Promise.all(
          createdItems.map(async (createdItem) => {
            return await this.orderItemRepo.excludeOrderItem(
              createdItem.id
            )
          })
        )
        await this.orderRepo.removeOrder(createdOrder.id)
    
        throw new Error(e.message)
      }

      createdOrder.items = createdItems

      return {
        order: createdOrder,
        passwordForFirstAccess
      }
    }catch(e){
      throw new Error(
        passwordForFirstAccess ?  `${e.message} @passwordForFirstAccess:${
          passwordForFirstAccess
        }` : e.message
      )
    }
  }

  private async handleUser({ customer } : {
    customer: Customer
  }) : Promise<[User, string | undefined]>{
    const findedUser = await this.userRepo.findUserByEmailOrPhone({
      search: customer.email,
      type: 'email'
    })

    if(findedUser) return [findedUser, undefined];
    
    const password = this.makePassword(6);
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await this.userRepo.createUser({
      name: customer.name,
      password: hashedPassword,
      type: 'client',
      email: customer.email,
    })

    return [user, password];
  }

  private makePassword(length: number) : string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length }).reduce<string>((acc, curr) => acc + characters.charAt(
      Math.floor(
        Math.random() * characters.length
      )
    ), '');
  }
}