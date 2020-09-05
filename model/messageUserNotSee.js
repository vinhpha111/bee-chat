const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new mongoose.Schema({
    message: { type: Schema.Types.ObjectId, ref: 'messages' },
    users: [{ type: Schema.Types.ObjectId, ref: 'users' }]
});

module.exports = mongoose.model('message_user_not_see', schema);