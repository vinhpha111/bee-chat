const roomUserModel = require('../model/roomUser')
const roomModel = require('../model/room')
const mongoose = require('mongoose')
const { TYPE_ROOM } = require('../config/constants')
const uniqid = require('uniqid')

function getRoom(key, asField) {
  return [
    {
      $lookup: {
        from: "rooms",
        let: { roomId: `$${key}` },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: [ "$$roomId", "$_id" ]
              }
            }
          }
        ],
        as: asField
      }
    },
    {
      $addFields: {
        [asField]: { "$arrayElemAt": [ `$${asField}`, 0 ] }
      }
    }
  ]
}

module.exports = {
  getRoomByUser: async (userId) => {
    let roomUserList = await roomUserModel.find({ user: userId }).populate('room').exec()
    let rooms = []
    for (let i in roomUserList) {
      if (roomUserList[i].room && roomUserList[i].room.type === TYPE_ROOM.ROOM_NORMAL) {
        rooms.push(roomUserList[i].room)
      }
    }
    return rooms
  },
  getListContactByUser: async (userId) => {
    let roomIds = await roomUserModel.aggregate([
      ...getRoom("room", "room"),
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ["$visible", true] },
              { $eq: ["$room.type", TYPE_ROOM.CONTACT_USER] },
              { $eq: [ "$user", mongoose.Types.ObjectId(userId) ] }
            ]
          }
        }
      }
    ]).exec()
    roomIds = roomIds.map(item => item.room?._id)
    let contacts = await roomUserModel.find({ room: { "$in": roomIds }, user: { $ne: userId } }).populate(["room", "user"]).exec()
    return contacts
  },
  getRoomBySlug: async (slug) => {
    const room = await roomModel.findOne({ slug })
    return room
  },
  getContactBySlug: async (slug, authUser) => {
    const room = await module.exports.getRoomBySlug(slug)
    if (!room) {
      return null
    }
    const contact = await roomUserModel.findOne({ room: room._id, user: { $ne: authUser._id } }).populate(["room", "user"]).exec()
    return contact
  },
  getRoleInRoom: async (userId, roomId) => {
    const userWithRoom = await roomUserModel.findOne({ user: userId, room: roomId })
    if (userWithRoom) {
      return userWithRoom.role
    }
    return null
  },
  create: async (data) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      let { userCreate, name, listUser, type } = data
      listUser = listUser.filter(id => id !== userCreate)
      listUser.push(userCreate)
      let slug = name.toLowerCase().replace(/\s/g, '_')
      if (await roomModel.count({ slug }) !== 0) {
        slug = slug + '_' + (new Date()).getTime()
      }
      let room = await (new roomModel({
        name: name,
        slug: slug,
        user_creat: userCreate,
        type: type || 1
      })).save({ session: session })
      let userRoomData = []
      for (let index in listUser) {
        const user = listUser[index]
        userRoomData.push({
          room,
          user,
          role: user === userCreate ? 1 : 2
        })
      }
      await roomUserModel.insertMany(userRoomData, { session })
      await session.commitTransaction()
      session.endSession();
      return room
    } catch (error) {
      console.log(error)
      await session.abortTransaction()
      session.endSession();
      return null
    }
    return null
  },
  findOrCreateRoomContact: async (fromUser, toUser) => {
    let room = await roomModel.aggregate([
      {
        "$lookup": {
          from: "room_users",
          let: {
            room_id: "$_id"
          },
          pipeline: [
            {
              "$match": {
                "$expr": {
                  $and: [
                    {
                      "$eq": [
                        "$$room_id",
                        "$room"
                      ]
                    },
                    {
                      "$in": [
                        "$user",
                        [
                          mongoose.Types.ObjectId(fromUser),
                          mongoose.Types.ObjectId(toUser)
                        ]
                      ]
                    }
                  ]
                }
              }
            }
          ],
          as: "room_users"
        }
      },
      {
        "$match": {
          $expr: {
            $and: [
              {
                "$gte": [
                  {
                    "$size": "$room_users"
                  },
                  2
                ]
              },
              {
                "$eq": [
                  "$type",
                  TYPE_ROOM.CONTACT_USER
                ]
              }
            ]
          }
        }
      },
      {
        "$project": {
          _id: 1,
          name: 1,
          slug: 1
        }
      },
      {
        $limit: 1
      }
    ]).exec()
    room = room ? room[0] : null

    if (!room) {
      let data = {
        userCreate: fromUser,
        name: uniqid(),
        listUser: [fromUser, toUser],
        type: TYPE_ROOM.CONTACT_USER
      }
      room = await module.exports.create(data)
      await module.exports.setVisibleRoomForUser(room._id, toUser, false)
    }
    await module.exports.setVisibleRoomForUser(room._id, fromUser, true)

    const contactUsers = await roomUserModel.findOne({
      room: room._id,
      user: toUser
    }).populate(['user', 'room']).exec()
    
    return contactUsers
  },
  setVisibleRoomForUser: async (roomId, userId, visible = true) => {
    const roomUser = await roomUserModel.findOne({
      room: roomId,
      user: userId
    })
    if (roomUser) {
      roomUser.visible = visible
      await roomUser.save()
      return roomUser
    }
    return false
  },
  setVisibleRoomForAllUser: async (roomId, visible = true) => {
    const roomUsers = await roomUserModel.find({
      room: roomId,
      visible: !visible
    })
    if (roomUsers) {
      await roomUserModel.updateMany(
        { 
          room: roomId,
          visible: !visible
        },
        {
          visible: visible
        }
      )
    }
    return true
  }
}