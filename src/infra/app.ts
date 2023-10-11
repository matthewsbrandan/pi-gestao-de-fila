import 'dotenv/config'

import cors from 'cors'
import express from 'express'
import session from 'express-session'
import passport from 'passport'
import bcrypt from 'bcrypt'
import path from 'path'
import ejs from 'ejs'
import http from 'http'
import flash from 'connect-flash';

import { Strategy as LocalStrategy } from 'passport-local'
import { Server } from 'socket.io'

import { router } from './routes/route'
import { User } from '../domain/entities/User'
import { FindUserByEmailOrPhoneFactory } from './factories/User/FindUserByEmailOrPhoneFactory'
import { FindUserByIdFactory } from './factories/User/FindUserByIdFactory'
import { route } from './routes/routenames'
import { FindOrdersByStartedQueueFactory } from './factories/Order/FindOrdersByStartedQueueFactory'
import { Order } from '../domain/entities/Order'
import { CreateOrderFactory } from './factories/Order/CreateOrderFactory'
import { UpdateOrderFactory } from './factories/Order/UpdateOrderFactory'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../public'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

app.use(express.urlencoded({ extended: false }));
app.use(session({
  // secret: process.env.SECRET_KEY,
  secret: "Segredo",
  saveUninitialized: false,
  resave: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000} // 24h - 1d
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(async (username: string, password: string, done: any) => {
    const user = await FindUserByEmailOrPhoneFactory().useCase.execute({
      search: username,
      type: username.includes('@') ? 'email' : 'phone',
      options: { include: ['password'] }
    })

    if (!user) return done(null, false, { result: false, response: 'Usuário não encontrado' });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) return done(null, false, { result: false, response: 'Senha incorreta' });

    return done(null, user);
  })
);
passport.serializeUser<any, any>((user: User, done: any) => { done(null, user.id) });
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await FindUserByIdFactory().useCase.execute(id)

    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use(flash());
app.use((req, res, next) => {
  res.locals.route = route
  res.locals.messages = req.flash('message');
  next();
});

app.use(router)

let lastIndex = 100;

(async () => {
  const loadOrders = async (exclude_ids: number[]) => {
    try{
      return await FindOrdersByStartedQueueFactory().useCase.execute({
        exclude_ids,
        status: ['pending', 'finished']
      })
    }catch(e){
      console.error('[error-on-load-queue]', e.message)
      return []
    }
  }

  let orders : Order[] = await loadOrders([])
  
  io.on('connection', async (socket) => {
    let newOrders =  await loadOrders(orders.map(o => o.id))
    orders.push(...newOrders)

    console.log(`Socket conectado ${socket.id}`);
  
    socket.emit('previousOrders', orders);
  
    socket.on('addOrder', async (order, cb) => {
      try{
        const newOrder = await CreateOrderFactory().useCase.execute(order)

        orders.push(newOrder);
        socket.broadcast.emit('receivedOrder', newOrder);

        cb({
          result: true,
          response: 'Pedido criado com sucesso',
          data: newOrder
        })
      }catch(e){
        cb({
          result: false,
          response: e.message ?? 'Não foi possível criar o pedido'
        })
      }
    });
  
    socket.on('removeOrder', (id) => {
      orders = orders.filter((o) => o.id !== id)
      socket.broadcast.emit('removedOrder', id);
    })
  
    socket.on('updateOrder', async (order, cb) => {
      try{
        const updateOrder = await UpdateOrderFactory().useCase.execute({
          id: order.id,
          status: order.status
        })
          
        if(order.status === 'withdrawn'){
          orders = orders.filter(o => o.id !== updateOrder.id)
          socket.broadcast.emit(
            'removedOrder', updateOrder.id
          );
        }
        else{
          orders = orders.map(o => o.id === updateOrder.id ? updateOrder : o)
          socket.broadcast.emit(
            'receivedOrder', updateOrder
          );
        }

        socket.broadcast.emit(
          `order_id:${updateOrder.id}`,
          updateOrder
        );

        cb({
          result: true,
          response: 'Pedido atualizado',
          data: updateOrder
        })
      }catch(e){
        cb({
          result: false,
          response: e.message ?? 'Não foi possível atualizar o status do pedido'
        })
      }      
    })
  });
})()


const port = process.env.SERVER_PORT || 3000

server.listen(port, () => console.log(`server running on port ${port}`))

export { app }