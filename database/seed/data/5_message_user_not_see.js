const userModel = require('../../../model/user')
const messageModel = require('../../../model/message')
const messageUserNotSeeModel = require('../../../model/messageUserNotSee')
module.exports = async () => {
    const user = await userModel.findOne({email: 'admin@gmail.com'})
    const message = await userModel.findOne({content: 'Hey, welcome you to Bee Chat! this is first message to you.'})
    if (user && message && ! await messageUserNotSeeModel.findOne({message, users: user})) {
        await (new messageUserNotSeeModel({
            message,
            users: [user]
        })).save()
    }
}