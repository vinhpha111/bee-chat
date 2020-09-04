const userModel = require('../model/user')
const userRepository = require('../repository/user')
const bcrypt = require('bcrypt')
const saltRounds = process.env.BCRYPT_SALT_ROUNDS || 10

module.exports = {
    login: async (req, res) => {
        let user = await userModel.findOne({email: req.body.email}).select('+hash_password').lean().exec()
        if (!user || ! await bcrypt.compare(req.body.password, user.hash_password)) {
            return res.status(422).json({ errors: [{
                param: 'not_exist_user',
                msg: 'user_or_password_not_exist'
            }] })
        }

        let tokenData = await userRepository.getToken(user._id)
        user.hash_password = null
        user.tokenData = tokenData
        return res.json({user})
    },
    getAuthInfo: async (req, res) => {
        let user = await userModel.findById(req.userInfo._id)
        res.json(user)
    }
}