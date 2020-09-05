const userModel = require('../../../model/user')
const roomModel = require('../../../model/room')
const messageModel = require('../../../model/message')
module.exports = async () => {
    const user = await userModel.findOne({email: 'admin@gmail.com'})
    const guest = await userModel.findOne({email: 'guest@gmail.com'})
    const room = await roomModel.findOne({name: 'First room'})
    const message = await messageModel.findOne({content: 'Hey, welcome you to Bee Chat! this is first message to you.'})
    const d = new Date()
    if (user && room && !message) {
        await (new messageModel({
            author: guest,
            content: 'Hey, welcome you to Bee Chat! this is first message to you.',
            type: 1, // in_room
            in_room: room,
            created_at: d.getTime(),
            updated_at: d.getTime()
        })).save()
    }
}