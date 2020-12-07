const { TYPE_EMIT_TO_ROOM, TYPE_EMIT_TO_MESSAGE } = require('../config/constants')
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
  },
  emitAddEmojiToMessage: async (emoji) => {
    const res = {
      type: TYPE_EMIT_TO_MESSAGE.ADD_EMOJI,
      result: { emoji }
    }
    io.in(emoji.message).emit(emoji.message, res)
  },
  emitRemoveEmojiFromMessage: async (emoji) => {
    const res = {
      type: TYPE_EMIT_TO_MESSAGE.REMOVE_EMOJI,
      result: { emoji }
    }
    io.in(emoji.message).emit(emoji.message, res)
  },
  emitUpdateMessage: async (message) => {
    const res = {
      type: TYPE_EMIT_TO_MESSAGE.EDIT_MESSAGE,
      result: { message }
    }
    io.in(message._id).emit(message._id, res)
  }
}