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
    getToken: async (id, oldRefreshToken = null) => {
        let user = await userModel.findById(id).select('+refresh_token').exec();
        if (user && !(oldRefreshToken && user.refresh_token.indexOf(oldRefreshToken) === -1)) {
            // console.log(user)
            let token = await jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
                data: {
                    _id: user._id,
                    email: user.email
                }
              }, jwtSecret);
            let refreshToken = await jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),
                data: {
                    _id: user._id,
                    email: user.email
                }
              }, jwtSecret);
            await user.updateOne({$push: {refresh_token: refreshToken}})
            if (oldRefreshToken) {
                await userModel.updateOne({ _id: id }, {$pull: {refresh_token: { $in: [oldRefreshToken] }}})
            }
            return { token, refreshToken }
        }
        return false
    },
    // return list user match email or name with string
    findByString: async (str) => {
        str = str.toLowerCase()
        let users = await userModel.find({
            $or: [
                { fullname: { $regex: new RegExp(str, 'i') } },
                { email: { $regex: new RegExp(str, 'i') } },
            ]
        }).limit(20)
        return users
    }
}