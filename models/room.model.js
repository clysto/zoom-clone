const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    subject: String,
    expireAt: Date,
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdDate: Date,
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

roomSchema.virtual('closed').get(function () {
  return this.expireAt < new Date();
});

module.exports = mongoose.model('Room', roomSchema);
