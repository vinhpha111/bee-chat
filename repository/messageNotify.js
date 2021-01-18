const messageNotifyModel = require("../model/messageNotify")
const messageSocket = require("../socket/message")
module.exports = {
  addOne: async (data) => {
    try {
      data.created_at = (new Date()).getTime()
      let messageNotify = new messageNotifyModel(data)
      await messageNotify.save()
      messageSocket.emitNewMessageNotify(messageNotify)
      return messageNotify
    } catch (error) {
      console.log('repository/messageNotify:')
      console.log(error)
    }
  },
  /* 
  data = [
    users: array user id,
    room: room id,
    message: message id,
    type: type notify
  ]
   */
  addManyUser: async (data) => {
    const users = data.users
    let notifyInserts = []
    for (const index in users) {
      const dataInsert = {
        room: data.room,
        message: data.message,
        user: users[index],
        type: data.type
      }
      const notify = await module.exports.addOne(dataInsert)
      notifyInserts.push(notify)
    }
    return notifyInserts
  },
  remove: async (messageId, userId) => {
    const notifyRemove = await messageNotifyModel.findOneAndDelete({message: messageId, user: userId})
    if (notifyRemove) {
      messageSocket.emitRemoveMessageNotify(notifyRemove)
    }
    return notifyRemove
  }
}