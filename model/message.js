const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new mongoose.Schema({
    author: { type: Schema.Types.ObjectId, ref: 'users' },
    content: String,
    type: Number, // 1: in_room, 2: in_user
    in_room: { type: Schema.Types.ObjectId, ref: 'rooms' },
    in_user: { type: Schema.Types.ObjectId, ref: 'users' },
    created_at: Date,
    updated_at: Date
});

module.exports = mongoose.model('messages', schema);