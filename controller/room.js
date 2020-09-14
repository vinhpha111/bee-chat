const roomRepository = require('../repository/room')
module.exports = {
    getListByUser: async (req, res) => {
        return res.json(await roomRepository.getRoomByUser(req.userInfo._id))
    },
    getRoleInRoom: async (req, res) => {
        const roomSlug = req.query.roomSlug
        if (!roomSlug) {
            return res.status(404).send('cannot found')
        }
        const room = await roomRepository.getRoomBySlug(roomSlug)
        if (!room) {
            return res.status(404).send('cannot found')
        }
        const role = await roomRepository.getRoleInRoom(req.userInfo._id, room._id)
        if (!role) {
            return res.status(404).send('cannot found')
        }
        return res.json(role)
    }
}