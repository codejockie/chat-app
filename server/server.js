import http from 'http';
import path from 'path';
import express from 'express';
import socketIO from 'socket.io';

const app = express();
const publicPath = path.join(__dirname, '../public');
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New User connected');

  socket.emit('newMessage', {
    from: 'Kennedy',
    text: 'Hey, what is going on? Let\'s chat',
    createdAt: 20170828
  });

  socket.on('createMessage', (newMessage) => {
    console.log('createMessage', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(process.env.PORT || '4200');