const mongoose = require('mongoose');

const Room = mongoose.model(
  'Room',
  new mongoose.Schema({
    subject: String,
    closed: Boolean,
    creator: mongoose.ObjectId,
  })
);

module.exports = Room;
