import http from 'http';
import path from 'path';
import express from 'express';
import socketIO from 'socket.io';

import generateMessage, { generateLocationMessage } from './utils/message';
import isRealString from './utils/validation';
import Users from './utils/Users';

const app = express();
const publicPath = path.join(__dirname, '../public');
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  socket.on('join', (params, callback) => {
    const room = params.room.toLowerCase();
    if (!isRealString(params.name) || !isRealString(room)) {
      return callback('Name and room name are required.');
    }

    // Check if a user already exists
    const user = users.getUserByUsername(params.name);

    // Ensure a user can join different rooms with same username
    if (user && user.room === room) {
      return callback('Username must be unique.');
    }


    // Join a specific room
    socket.join(room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, room);

    io.to(room).emit('updateUserList', users.getUserList(room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${params.name} joined`));

    console.log(`${params.name} joined ${room} room.`);
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    const user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }

    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    const user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} left.`));

      console.log(`${user.name} left ${user.room} room.`);
    }
  });
});

server.listen(process.env.PORT || '4200');
