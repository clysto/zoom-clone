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

router.get('/rooms/:id', param('id').isMongoId(), (req, res) => {
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

router.get('/rooms/:id/token', param('id').isMongoId(), auth, (req, res) => {
  const errors = validationResult(req);
  // 验证body
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }
  const roomId = req.params.id;
  const userId = req.user.id;
  Room.findById(roomId)
    .populate('creator')
    .exec((err, room) => {
      if (err) throw err;

      if (room && !room.closed) {
        const expireAt = new Date(Date.now() + 1 * 3600 * 24 * 1000);
        const token = genRoomToken(roomId, userId, expireAt);
        room = room.toJSON();
        room.token = token;
        res.json(room);
      } else if (!room) {
        res.status(404).json({
          error: `没有找到id为${roomId}的会议室房间`,
        });
      } else {
        res.status(404).json({
          error: `id为${roomId}的会议室房间已经结束`,
        });
      }
    });
});

router.get('/rooms', auth, (req, res) => {
  Room.find({ creator: req.user.id })
    .sort({ createdDate: -1 })
    .exec((err, rooms) => {
      if (err) throw err;
      res.json(rooms);
    });
});

router.delete('/rooms/:id', param('id').isMongoId(), auth, (req, res) => {
  const errors = validationResult(req);
  // 验证body
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }
  Room.deleteOne({ creator: req.user.id, _id: req.params.id }, (err) => {
    if (err) throw err;
    res.sendStatus(204);
  });
});

router.put('/rooms/:id/closed', param('id').isMongoId(), auth, (req, res) => {
  Room.findOne({ _id: req.params.id, creator: req.user.id }, (_, room) => {
    if (room) {
      room.expireAt = new Date();
      room.save();
      const roomJson = room.toJSON();
      roomJson.closed = true;
      res.json(roomJson);
    }
  });
});

module.exports = router;
