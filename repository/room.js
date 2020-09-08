const roomUserModel = require('../model/roomUser')
const roomModel = require('../model/room')

module.exports = {
    getRoomByUser: async (userId) => {
        let roomUserList = await roomUserModel.find({user: userId}).populate('room').exec()
        let rooms = []
        for (let i in roomUserList) {
            rooms.push(roomUserList[i].room)
        }
        return rooms
    },
    getRoomBySlug: async (slug) => {
        const room = await roomModel.findOne({slug})
        return room
    }
}