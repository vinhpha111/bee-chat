const roomUserModel = require('../model/roomUser')
const roomUser = require('../model/roomUser')
module.exports = {
    getRoomByUser: async (userId) => {
        let roomUserList = await roomUserModel.find({user: userId}).populate('room').exec()
        let rooms = []
        for (let i in roomUserList) {
            rooms.push(roomUserList[i].room)
        }
        return rooms
    }
}