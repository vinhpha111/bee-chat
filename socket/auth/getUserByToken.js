var jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET || 'secret'
module.exports = async (req) => {
  if (req.token) {
    try {
      req.user = (await jwt.verify(req.token, jwtSecret)).data;
    } catch (error) {
      req.expired = true
    }
  }
  return req
}