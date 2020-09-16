const roomModel = require('../../../model/room')
const userModel = require('../../../model/user')

module.exports = async () => {
    await roomModel.deleteMany()
    const user = await userModel.findOne({email: 'admin@gmail.com'})
    const room = await roomModel.findOne({name: 'First room'})
    if (user && !room) {
        await (new roomModel({
            name: 'First room',
            slug: 'first_room',
            user_creat: user._id,
            type: 1
        })).save()
    }
}