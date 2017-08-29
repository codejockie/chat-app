import http from 'http';
import path from 'path';
import express from 'express';
import socketIO from 'socket.io';

import generateMessage, { generateLocationMessage } from './utils/message';

const app = express();
const publicPath = path.join(__dirname, '../public');
const server = http.createServer(app);
const io = socketIO(server);
let numberOfConnectedUsers = 0;

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  numberOfConnectedUsers++;
  console.log(`User ${numberOfConnectedUsers} connected`);

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('This is from the server');
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    numberOfConnectedUsers--;
    console.log(`User ${numberOfConnectedUsers} was disconnected`);
  });
});

server.listen(process.env.PORT || '4200');