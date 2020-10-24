const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('./user')
const Message = require('./message')

const schema = new mongoose.Schema({
    author: { type: Schema.Types.ObjectId, ref: User },
    type: Number, // 1: char, 2: image
    message: { type: Schema.Types.ObjectId, ref: Message },
    emoji: String,
    created_at: Date
});

module.exports = mongoose.model('message_emojis', schema);