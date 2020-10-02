const io = require('socket.io');
const { JOIN_ROOM, CREATE_ROOM } = require('./events');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env['JWT_SECRET'];

function SocketServer(httpServer, opts) {
  const server = io(httpServer, opts);

  // 验证用户是否登陆
  server.use((socket, next) => {
    const token = socket.handshake.query.token;
    if (token) {
      // 验证JsonWebToken
      jwt.verify(token, JWT_SECRET, (err, user) => {
        // 这里有问题
        if (err) throw err;
        if (user) {
          // token验证成功
          socket.user = user;
          next();
        }
      });
    }
  });

  server.on('connection', (socket) => {
    socket.on(JOIN_ROOM, (data) => {
      socket.join(data.roomId);
    });
  });
}

module.exports = SocketServer;
