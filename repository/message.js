const mongoose = require('mongoose')
const roomRepository = require('./room')
const messageModel = require('../model/message')
const roomUserModel = require('../model/roomUser')
const messageEmojiModel = require('../model/messageEmoji')
const messageNotifyModel = require('../model/messageNotify')
const messageSocket = require('../socket/message')
const { TYPE_OF_MESSAGE, TYPE_EMOJI, TYPE_MESSAGE_NOTIFY } = require('../config/constants')
const { findByIdAndDelete } = require('../model/roomUser')
const messageNotifyRepository = require('./messageNotify')

const getAuthor = [{
    $lookup: {
      from: 'users',
      // localField: "author",
      let: {
        author: "$author"
      },
      // foreignField: "_id",
      pipeline: [{
          $match: {
            $expr: {
              $eq: ["$_id", "$$author"]
            }
          }
        },
        {
          $addFields: {
            "avatar_path": {
              $cond: {
                if: "$avatar",
                then: {
                  $concat: ['/avatar/', '$avatar']
                },
                else: null
              }
            }
          },
        }
      ],
      as: "author"
    }
  },
  {
    $addFields: {
      "author": {
        "$arrayElemAt": ["$author", 0]
      }
    },
  },
  {
    $unset: ["author.hash_password", "author.refresh_token"]
  }
]
const getEmoji = {
  $lookup: {
    from: 'message_emojis',
    let: {
      message_id: "$_id"
    },
    pipeline: [{
      $match: {
        $expr: {
          $eq: ["$message", "$$message_id"]
        }
      }
    }].concat(getAuthor),
    as: 'emojis'
  }
}

module.exports = {
  getListMessageInRoom: async (slugRoom, query = {}, userId = null) => {
    const exceptIds = (query.exceptIds || []).map(id => mongoose.Types.ObjectId(id))
    const room = await roomRepository.getRoomBySlug(slugRoom)
    if (room) {
      let messages = await messageModel.aggregate([{
          $match: {
            $or: [{
                parent: {
                  $exists: false
                }
              },
              {
                parent: {
                  $eq: null
                }
              }
            ],
            _id: {
              $nin: exceptIds || []
            },
            in_room: room._id
          }
        },
        {
          $lookup: {
            from: 'messages',
            let: {
              parent_id: "$_id"
            },
            pipeline: [{
                $match: {
                  $expr: {
                    $eq: ["$parent", "$$parent_id"]
                  }
                }
              },
              getEmoji
            ].concat(getAuthor),
            as: 'childrens'
          }
        },
        // check exist notify
        {
          $lookup: {
            from: 'message_notifies',
            let: {
              message: "$_id"
            },
            pipeline: [{
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$message", "$$message"] },
                      { $eq: ["$user", mongoose.Types.ObjectId(userId)] }
                    ]
                  }
                }
              }
            ],
            as: 'notify'
          }
        },
        {
          $addFields: {
            "notify": {
              $cond: { if: { $gte: [ { $size: "$notify"}, 1 ] }, then: true, else: false }
            }
          },
        },

        getEmoji,
        {
          $sort: {
            _id: -1
          }
        },
        {
          $limit: 10
        }
      ].concat(getAuthor)).exec()
      return messages
    }
    return []
  },
  addMessageInRoom: async (req) => {
    const author = req.userInfo._id
    const content = req.body.content
    const type = TYPE_OF_MESSAGE.IN_ROOM
    const in_room = req.body.roomId
    let userInRoom = await roomUserModel.find({
      room: in_room
    })
    userInRoom = userInRoom.map(userRoom => userRoom.user)
    const userNotSee = userInRoom.filter(user => user != author)
    const parent = req.body.parent || null
    const nowTime = (new Date()).getTime()
    const created_at = nowTime
    const updated_at = nowTime
    let message = new messageModel({
      author,
      content,
      type,
      in_room,
      parent,
      created_at,
      updated_at
    })
    await message.save()
    messageNotifyRepository.addManyUser({
      users: userNotSee,
      room: in_room,
      message: message._id,
      type: TYPE_MESSAGE_NOTIFY.NORMAL
    })
    try {
      message = await module.exports.getMessageById(message._id)
      messageSocket.emitMessageToUserByRoom({
        listUser: userInRoom,
        room: in_room,
        message
      })
    } catch (error) {
      console.log(error)
    }
    return message
  },
  getMessageById: async (id) => {
    id = mongoose.Types.ObjectId(id)
    let messages = await messageModel.aggregate([{
        $match: {
          _id: {
            $eq: id
          },
        }
      },
      {
        $lookup: {
          from: 'messages',
          let: {
            parent_id: "$_id"
          },
          pipeline: [{
              $match: {
                $expr: {
                  $eq: ["$parent", "$$parent_id"]
                }
              }
            },
            getEmoji
          ].concat(getAuthor),
          as: 'childrens'
        }
      },
      getEmoji,
      {
        $sort: {
          _id: -1
        }
      },
      {
        $limit: 1
      }
    ].concat(getAuthor)).exec()
    return messages ? messages[0] : null
  },
  addEmoji: async (req, type) => {
    let data = {
      author: req.userInfo._id,
      type,
      message: req.body.message_id,
      emoji: JSON.stringify(req.body.emoji),
      created_at: (new Date()).getTime()
    }
    const emoji = await (new messageEmojiModel(data)).save()
    try {
      const emojiEmit = await messageEmojiModel.findById(emoji._id).populate('author')
      messageSocket.emitAddEmojiToMessage(emojiEmit)
    } catch (error) {
      console.log(error)
    }
    return emoji
  },
  removeEmoji: async (req) => {
    const emoji = await messageEmojiModel.findByIdAndDelete(req.body.id)
    try {
      messageSocket.emitRemoveEmojiFromMessage(emoji)
    } catch (error) {
      console.log(error)
    }
    return emoji
  },
  edit: async (data) => {
    let message = await messageModel.findById(data.id)
    if (!message) {
      throw "Can't find message!"
    }
    if (!(data.content?.length > 0)) {
      throw "Data empty"
    }
    message.content = data.content
    message.updated_at = (new Date()).getTime()
    await message.save()
    messageSocket.emitUpdateMessage(message)
    return message
  },
  remove: async (id) => {
    await messageNotifyModel.deleteMany({message: id})
    await messageEmojiModel.deleteMany({message: id})
    await messageModel.deleteOne({_id: id})
    return true
  }
}