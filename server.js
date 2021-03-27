const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const bot = 'Texter';

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({username, room}) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(bot,'Welcome to Texter')); // Only to the client which connects

    // Broadcast when a user connects
    socket.broadcast
    .to(user.room)
    .emit('message', formatMessage(bot,`${user.username} has joined the chat`));  // to all except the client whicb connects

    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

// sending messages
  socket.on('chatMessage', msg =>{
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message',formatMessage(user.username, msg));
  });

  // run when a user disconnects
  socket.on('disconnect', ()=>{
    const user = userLeave(socket.id);

    if(user){
      io
      .to(user.room)
      .emit('message', formatMessage(bot,`${user.username} has left the chat`)); //to all the client

      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on ${PORT}`));
