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

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(process.env.PORT || '4200');