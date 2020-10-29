const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: String,
    fullname: String,
    hash_password: { type: String, select: false },
    online: Boolean,
    refresh_token: { type: [String], select: false },
    role: Number,
    avatar: String
});

userSchema.set('toObject', { virtuals: true })
userSchema.set('toJSON', { virtuals: true })

userSchema.virtual('avatar_path').get(function() {
    return this.avatar ? '/avatar/' + this.avatar : null
})

module.exports = mongoose.model('users', userSchema);