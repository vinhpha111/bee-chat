const roomModel = require('../../../model/room')
const userModel = require('../../../model/user')
const roomUserModel = require('../../../model/roomUser')

module.exports = async () => {
    const user = await userModel.findOne({email: 'admin@gmail.com'})
    const guest = await userModel.findOne({email: 'guest@gmail.com'})
    const room = await roomModel.findOne({name: 'First room'})
    if (user && room && ! await roomUserModel.findOne({user, room}) && ! await roomUserModel.findOne({user: guest, room})) {
        await roomUserModel.insertMany([
            {
                user,
                room,
                role: 1, // admin
            },
            {
                user: guest,
                room,
                role: 2, // guest
            },
        ])
    }
}