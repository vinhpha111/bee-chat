const userModel = require('../../../model/user')
const bcrypt = require('bcrypt')
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
module.exports = async () => {
    if (! await userModel.findOne({email: 'admin@gmail.com'}) && ! await userModel.findOne({email: 'guest@gmail.com'})) {
        await userModel.insertMany([
            {
                email: 'admin@gmail.com',
                fullname: 'Admin',
                hash_password: await bcrypt.hash('11111111', saltRounds),
                role: 1
            },
            {
                email: 'guest@gmail.com',
                fullname: 'Guest',
                hash_password: await bcrypt.hash('11111111', saltRounds),
                role: 2
            }
        ])
    }
}