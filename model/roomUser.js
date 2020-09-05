const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new mongoose.Schema({
    room: { type: Schema.Types.ObjectId, ref: 'rooms' },
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    role: Number
});

module.exports = mongoose.model('room_users', schema);