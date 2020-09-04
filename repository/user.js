const userModel = require('../model/user')
var jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET || 'secret'
module.exports = {
    checkEmailExist: async (email) => {
        let user = await userModel.findOne({email})
        if (user) {
            return true
        }
        return false
    },
    getToken: async (id) => {
        let user = await userModel.findById(id);
        if (user) {
            console.log(user.toJSON())
            let token = await jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
                data: user
              }, jwtSecret);
            let refreshToken = await jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),
                data: user
              }, jwtSecret);
            console.log(refreshToken)
            await user.update({$push: {refresh_token: refreshToken}})
            return { token, refreshToken }
        }
        return false
    }
}