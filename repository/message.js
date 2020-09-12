const mongoose = require('mongoose')
const roomRepository = require('./room')
const messageModel = require('../model/message')
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
                        parent: { $exists: false },
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
    }
}