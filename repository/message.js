const mongoose = require('mongoose')
const roomRepository = require('./room')
const messageModel = require('../model/message')
const roomUserModel = require('../model/roomUser')
const messageSocket = require('../socket/message')
const { TYPE_OF_MESSAGE } =  require('../config/constants')

module.exports = {
    getListMessageInRoom: async (slugRoom, query = {}) => {
        const exceptIds = (query.exceptIds || []).map(id => mongoose.Types.ObjectId(id))
        const room = await roomRepository.getRoomBySlug(slugRoom)
        const getAuthor = [
            {
                $lookup: {
                    from: 'users',
                    localField: "author",
                    foreignField: "_id",
                    as: "author"
                }
            },
            { $addFields: { "author": { "$arrayElemAt": [ "$author", 0 ] } } },
            {
                $unset: ["author.hash_password", "author.refresh_token"]
            }
        ]
        if (room) {
            let messages = await messageModel.aggregate([
                {
                    $match: {
                        $or: [
                            { parent: { $exists: false } },
                            { parent: { $eq: null } }
                        ],
                        _id: { $nin: exceptIds || [] },
                        in_room: room._id
                    }
                },
                {
                    $lookup: {
                        from: 'messages',
                        let: { parent_id: "$_id" },
                        pipeline: [
                            {
                                $match: { 
                                    $expr: { $eq: [ "$parent", "$$parent_id" ] }
                                }
                            }
                        ].concat(getAuthor),
                        as: 'childrens'
                    }
                },
                {
                    $sort: {_id: -1}
                },
                { $limit : 10 }
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
        let userInRoom = await roomUserModel.find({room: in_room})
        userInRoom = userInRoom.map(userRoom => userRoom.user)
        const user_not_see = userInRoom.filter(user => user != author)
        const parent = req.body.parent || null
        const created_at = (new Date()).getTime()
        const updated_at = (new Date()).getTime()
        let message = new messageModel({ author, content, type, in_room, user_not_see, parent, created_at, updated_at })
        await message.save()
        try {
            message = (await module.exports.getMessageById(message._id))[0]
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
        const getAuthor = [
            {
                $lookup: {
                    from: 'users',
                    localField: "author",
                    foreignField: "_id",
                    as: "author"
                }
            },
            { $addFields: { "author": { "$arrayElemAt": [ "$author", 0 ] } } },
            {
                $unset: ["author.hash_password", "author.refresh_token"]
            }
        ]
        let messages = await messageModel.aggregate([
            {
                $match: {
                    _id: { $eq: id },
                }
            },
            {
                $lookup: {
                    from: 'messages',
                    let: { parent_id: "$_id" },
                    pipeline: [
                        {
                            $match: { 
                                $expr: { $eq: [ "$parent", "$$parent_id" ] }
                            }
                        }
                    ].concat(getAuthor),
                    as: 'childrens'
                }
            },
            {
                $sort: {_id: -1}
            },
            { $limit : 10 }
        ].concat(getAuthor)).exec()
        return messages
    }
}