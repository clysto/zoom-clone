const auth = require('../middlewares/auth.midddleware');
const router = require('express').Router();
const { body, validationResult, param } = require('express-validator');
const Room = require('../models/room.model');
const { genRoomToken } = require('../qiniu/rtc');
const mongoose = require('mongoose');

function objectIdValidator(value) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error('Invalid Mongodb ObjectId');
  }
  return true;
}

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

router.get('/rooms/:id', param('id').custom(objectIdValidator), (req, res) => {
  const errors = validationResult(req);
  // 验证body
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }
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

router.get(
  '/rooms/:id/token',
  param('id').custom(objectIdValidator),
  auth,
  (req, res) => {
    const errors = validationResult(req);
    // 验证body
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }
    const roomId = req.params.id;
    const userId = req.user.id;
    Room.findById(roomId, (err, room) => {
      if (err) throw err;

      if (room) {
        const expireAt = new Date(Date.now() + 1 * 3600 * 24 * 1000);
        const token = genRoomToken(roomId, userId, expireAt);
        room = room.toJSON();
        room.token = token;
        res.json(room);
      } else {
        res.status(404).json({
          error: `没有找到id为${roomId}的会议室房间`,
        });
      }
    });
  }
);

router.get('/rooms', auth, (req, res) => {
  Room.find({ creator: req.user.id }, (err, rooms) => {
    if (err) throw err;
    res.json(rooms);
  });
});

module.exports = router;
