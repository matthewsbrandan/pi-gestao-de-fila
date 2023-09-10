import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import router from './routes/route'
import path from 'path'
import ejs from 'ejs'
import http from 'http'
import { Server } from 'socket.io'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../public'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

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

