const userModel = require('../../../model/user')
const bcrypt = require('bcrypt')
const saltRounds = process.env.BCRYPT_SALT_ROUNDS || 10
module.exports = async () => {
    await (new userModel({
        email: 'usertestseed@gmail.com',
        fullname: 'usertestseed',
        hash_password: await bcrypt.hash('11111111', saltRounds)
    })).save()
}