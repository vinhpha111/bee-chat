const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Room = require('./room')
const User = require('./user')

const schema = new mongoose.Schema({
    room: { type: Schema.Types.ObjectId, ref: Room },
    user: { type: Schema.Types.ObjectId, ref: User },
    visible: { type: Boolean, default: true },
    role: Number
});

module.exports = mongoose.model('room_users', schema);