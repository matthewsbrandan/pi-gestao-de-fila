import 'dotenv/config'

import cors from 'cors'
import express from 'express'
import session from 'express-session'
import passport from 'passport'
import bcrypt from 'bcrypt'
import path from 'path'
import ejs from 'ejs'
import http from 'http'

import { Strategy as LocalStrategy } from 'passport-local'
import { Server } from 'socket.io'

import router from './routes/route'
import { User } from '../domain/entities/User'
import { FindUserByEmailOrPhoneFactory } from './factories/User/FindUserByEmailOrPhoneFactory'
import { FindUserByIdFactory } from './factories/User/FindUserByIdFactory'

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
app.use(session({ secret: process.env.SECRET_KEY, resave: false, saveUninitialized: false }));
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

app.use(router)

let lastIndex = 100;
let orders : { id: number, status: 'in-progress' | 'concluded' }[] = []
io.on('connection', (socket) => {
  console.log(`Socket conectado ${socket.id}`);

  socket.emit('previousOrders', orders);

  socket.on('addOrder', (data) => {
    const id = lastIndex + 1
    if(!data.id) lastIndex = id
    
    orders.push({
      ...data,
      id: data.id ? data.id : id
    });

    socket.broadcast.emit('receivedOrder', data);
  });

  socket.on('removeOrder', (id) => {
    orders = orders.filter((o) => o.id !== id)
    socket.broadcast.emit('removedOrder', id);
  })
});


const port = process.env.SERVER_PORT || 3001

app.listen(port, () => console.log(`server running on port ${port}`))

export { app }