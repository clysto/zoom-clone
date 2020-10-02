const auth = require('../middlewares/auth.midddleware');
const router = require('express').Router();
const { body, validationResult, param } = require('express-validator');
const Room = require('../models/room.model');
const { genRoomToken } = require('../qiniu/rtc');

router.post('/rooms', auth, [body('subject').notEmpty()], (req, res) => {
  const errors = validationResult(req);
  // 验证body
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }
  const room = new Room();
  room.creator = req.user.id;
  room.subject = req.body.subject;
  const expireAt = new Date(Date.now() + 10 * 3600 * 24 * 1000);
  room.expireAt = expireAt;
  room.createdDate = new Date();
  room.save();
  res.status(201).json(room);
});

router.get('/rooms/:id', (req, res) => {
  const roomId = req.params.id;
  Room.findById(roomId, (err, room) => {
    if (err) throw err;

    if (room) {
      res.json(room);
    } else {
      res.status(404).json({
        error: `没有找到id为${roomId}的会议室房间`,
      });
    }
  });
});

router.get('/rooms/:id/token', auth, (req, res) => {
  const roomId = req.params.id;
  const userId = req.user.id;
  Room.findById(roomId, (err, room) => {
    if (err) throw err;

    if (room) {
      const expireAt = new Date(Date.now() + 1 * 3600 * 24 * 1000);
      const token = genRoomToken(roomId, userId, expireAt);
      room.token = token;
      res.json(room);
    } else {
      res.status(404).json({
        error: `没有找到id为${roomId}的会议室房间`,
      });
    }
  });
});

module.exports = router;
