require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const server = require('http').createServer(app);
const SocketServer = require('./io');

const PORT = process.env['PORT'];

const authRoute = require('./routes/auth.route');
const roomRoute = require('./routes/room.route');

require('./auth/config');

// 连接数据库
mongoose.connect(process.env['DB_URL'], {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env['DB_NAME'],
  user: process.env['DB_USER'],
  pass: process.env['DB_PWD'],
});

SocketServer(server);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(authRoute);
app.use(roomRoute);

// 启动HTTP服务
server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
