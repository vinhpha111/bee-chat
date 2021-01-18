const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new mongoose.Schema({
  room: {
    type: Schema.Types.ObjectId,
    ref: 'rooms'
  },
  message: {
    type: Schema.Types.ObjectId,
    ref: 'messages'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  created_at: Date,
  type: Number
});

module.exports = mongoose.model('message_notifies', schema);