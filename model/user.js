const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: String,
    fullname: String,
    hash_password: { type: String, select: false },
    online: Boolean,
    refresh_token: { type: [String], select: false }
});

module.exports = mongoose.model('users', userSchema);