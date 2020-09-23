const { TYPE_EMIT_TO_ROOM } = require('../config/constants')
module.exports = {
  emitMessageToUserByRoom: async (data) => {
    const listUser = data.listUser
    const room = data.room
    const message = data.message
    for (let index in listUser) {
      io.in(listUser[index]).emit(room, {
        type: TYPE_EMIT_TO_ROOM.NEW_MESSAGE,
        message
      })
    }
  }
}