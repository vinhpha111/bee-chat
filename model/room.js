const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new mongoose.Schema({
    name: String,
    slug: String,
    deleted: Boolean,
    user_creat: { type: Schema.Types.ObjectId, ref: 'users' },
    type: Number
});

module.exports = mongoose.model('rooms', schema);