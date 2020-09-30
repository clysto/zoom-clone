const io = require('socket.io-client');
const fetch = require('isomorphic-unfetch');
const { JOIN_ROOM, CREATE_ROOM } = require('../io/events');

const BASE_URL = 'http://localhost:8000';

fetch(`${BASE_URL}/login`, {
  body: JSON.stringify({
    username: 'myc',
    password: '123456',
  }),
  headers: {
    'content-type': 'application/json',
  },
  method: 'POST',
})
  .then((r) => r.json())
  .then((data) => {
    const token = data.token;

    const socket = io('http://localhost:8000', {
      query: { token },
    });

    socket.on('connect', () => {
      // socket.emit(JOIN_ROOM, { roomId: '5f719e4d6377331b7534b2be' });
      socket.emit(CREATE_ROOM, { subject: '你好世界2' });
    });
  });
