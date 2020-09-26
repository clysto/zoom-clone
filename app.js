require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { ExpressPeerServer } = require('peer');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env['PORT'];

// 连接数据库
mongoose.connect(process.env['DB_URL'], {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env['DB_NAME'],
  user: process.env['DB_USER'],
  pass: process.env['DB_PWD'],
});

// 启动HTTP服务
const server = app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

// 挂载peerjs服务
const peerServer = ExpressPeerServer(server, {
  path: '/app',
});

app.use('/peerjs', peerServer);
