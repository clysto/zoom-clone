const mongoose = require('mongoose');

const Room = mongoose.model(
  'Room',
  new mongoose.Schema({
    subject: String,
    expireAt: Date,
    creator: mongoose.ObjectId,
    createdDate: Date,
  })
);

module.exports = Room;
