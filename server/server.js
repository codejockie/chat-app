import http from 'http';
import path from 'path';
import express from 'express';
import socketIO from 'socket.io';

const app = express();
const publicPath = path.join(__dirname, '../public');
const server = http.createServer(app);
const io = socketIO(server);
let numberOfConnectedUsers = 0;

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  numberOfConnectedUsers++;
  console.log(`User ${numberOfConnectedUsers} connected`);

  socket.on('createMessage', (message) => {
    console.log('createMessage', message);
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
  });

  socket.on('disconnect', () => {
    numberOfConnectedUsers--;
    console.log(`User ${numberOfConnectedUsers} was disconnected`);
  });
});

server.listen(process.env.PORT || '4200');