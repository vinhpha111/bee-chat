var jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET || 'secret'
module.exports = async (req, res, next) => {
    if (req.token) {
        try {
            let userInfo = await jwt.verify(req.token, jwtSecret);
            req.userInfo = userInfo.data
        } catch (error) {
        }
    }
    return next()
}