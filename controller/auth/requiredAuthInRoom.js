let roomUserModel = require('../../model/roomUser')
module.exports = (arrAuth = []) => {
    return async (req, res, next) => {
        if (!req.userInfo) {
            if (req.expired) {
                return res.status(498).send('expired')
            }
            return res.status(403).send('unauthorization')
        }

        let roomUser = await roomUserModel.findOne({room: req.body.roomId, user: req.userInfo._id })
        if (!roomUser || (arrAuth.length !== 0 && arrAuth.indexOf(roomUser.role) === -1)) {
            return res.status(403).send('unauthorization')
        }

        return next()
    }
}