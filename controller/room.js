const roomRepository = require('../repository/room')
module.exports = {
    getListByUser: async (req, res) => {
        return res.json(await roomRepository.getRoomByUser(req.userInfo._id))
    }
}