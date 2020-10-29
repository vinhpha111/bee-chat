const userModel = require('../model/user')
const userRepository = require('../repository/user')
const bcrypt = require('bcrypt')
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
var jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET || 'secret'
const path = require('path')
const helper = require('../config/helper')
const fs = require('fs')

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
    logout: async (req, res) => {
        const refreshToken = req.body.refreshToken
        const user = await userRepository.removeRefreshToken(req.userInfo._id, refreshToken)
        return res.status(200).json(user)
    },
    getToken: async (req, res) => {
        const refreshToken = req.body.refreshToken
        if (refreshToken) {
            try {
                const userInfo = await jwt.verify(refreshToken, jwtSecret)
                console.log(userInfo.data._id)
                const tokenData = await userRepository.getToken(userInfo.data._id, refreshToken)
                if (tokenData) {
                    return res.status(200).json(tokenData)
                }
            } catch (error) {
                return res.status(498).send('expired')
            }
        }
        return res.status(403).send('unauthorization')
    },
    getAuthInfo: async (req, res) => {
        let user = await userModel.findById(req.userInfo._id)
        return res.json(user)
    },
    findByString: async (req, res) => {
        const users = await userRepository.findByString(req)
        return res.status(200).json(users)
    },
    editAccount: async (req, res) => {
        let user = await userModel.findById(req.userInfo._id).select('+hash_password').exec()
        if (req.body.fullname && req.body.fullname.length > 0) {
            user.fullname = req.body.fullname
        }
        if (req.body.email && req.body.email.length > 0) {
            user.email = req.body.email
        }
        if (req.body.password && req.body.new_password && req.body.new_password_confirm) {
            if (await bcrypt.compare(req.body.password, user.hash_password)) {
                user.hash_password = await bcrypt.hash(req.body.new_password, saltRounds)
            } else {
                return res.status(422).json({ errors: [{
                    param: 'password',
                    msg: 'validation.password_not_correct'
                }]})
            }
        }
        let avatarRemove = null
        if (req.body.avatar) {
            avatarRemove = user.avatar
            user.avatar = path.basename(req.body.avatar)
        }
        await user.save()
        if (avatarRemove) {
            fs.unlink(helper.rootPath(`upload/avatar/${avatarRemove}`), (err) => {
                if (err) throw err
            })
        }
        user = await userModel.findById(req.userInfo._id)
        return res.json(user)
    }
}