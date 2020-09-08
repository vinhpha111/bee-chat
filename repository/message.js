const roomRepository = require('./room')
const messageModel = require('../model/message')
const { TYPE_OF_MESSAGE } =  require('../config/constants')
module.exports = {
    getListMessageInRoom: async (slugRoom) => {
        const room = await roomRepository.getRoomBySlug(slugRoom)
        if (room) {
            let messages = await messageModel.find({
                type: TYPE_OF_MESSAGE.IN_ROOM,
                in_room: room,
                $or: [
                    { parent: null },
                    { parent : { $exists: false } }
                ]
            }).populate('author').exec()
            let listMesage = messages.map(obj => obj.toJSON())
            for (let index in messages) {
                messages[index] = messages[index].toJSON()
                messages[index].childrens = listMesage
            }
            return messages
        }
        return []
    }
}