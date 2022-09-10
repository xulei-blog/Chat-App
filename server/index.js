const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const socket = require('socket.io');
const tokens = require('./token/index');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(tokens);
app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoutes);


mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("DB Connection Sucessfully");
}).catch(err => {
  console.log(err.message);
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server Started on Port ${process.env.PORT}`);
})

const io = socket(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  }
})

//存储所有在线用户
global.onlineUsers = new Map();

io.on('connection', (socket) => {
  global.chatSocket = socket;
  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id);
  })

  //用户登陆后便会建立socket连接。用户在线时，便会触发add-user加入onlineUsers
  //前端发送消息会触发send-msg，后端将向在线用户发送消息
  socket.on('send-msg', (data) => {
    const sendUserSocket = global.onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.message);
    }
  })
})