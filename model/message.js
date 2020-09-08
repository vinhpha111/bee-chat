const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('./user')
const Room = require('./room')

const schema = new mongoose.Schema({
    author: { type: Schema.Types.ObjectId, ref: User },
    content: String,
    type: Number, // 1: in_room, 2: in_user
    in_room: { type: Schema.Types.ObjectId, ref: Room },
    in_user: { type: Schema.Types.ObjectId, ref: User },
    user_not_see: [{ type: Schema.Types.ObjectId, ref: User }],
    parent: { type: Schema.Types.ObjectId, ref: 'messages' },
    created_at: Date,
    updated_at: Date
});

module.exports = mongoose.model('messages', schema);