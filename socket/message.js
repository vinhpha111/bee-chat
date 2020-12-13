const { TYPE_EMIT_TO_ROOM, TYPE_EMIT_TO_MESSAGE, EVENT_TO_COMMON_PER_USER, TYPE_EMIT_TO_COMMON } = require('../config/constants')
const messageNotify = require('../model/messageNotify')
const messageNotifyModel = require("../model/messageNotify")
module.exports = {
  emitMessageToUserByRoom: async (data) => {
    const listUser = data.listUser
    const room = data.room
    const message = data.message
    message.notify = true
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
  },
  emitNewMessageNotify: async (messageNotify) => {
    const res = {
      type: TYPE_EMIT_TO_COMMON.NEW_MESSAGE_NOTIFY,
      result: await messageNotifyModel.findOne(messageNotify._id).populate('message').populate('user')
    }
    io.in(messageNotify.user).emit(EVENT_TO_COMMON_PER_USER, res)
  },
  emitRemoveMessageNotify: async (messageNotify) => {
    const res = {
      type: TYPE_EMIT_TO_COMMON.REMOVE_MESSAGE_NOTIFY,
      result: messageNotify
    }
    io.in(messageNotify.user).emit(EVENT_TO_COMMON_PER_USER, res)
  }
}