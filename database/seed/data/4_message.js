const userModel = require('../../../model/user')
const roomModel = require('../../../model/room')
const messageModel = require('../../../model/message')
module.exports = async () => {
    const user = await userModel.findOne({email: 'admin@gmail.com'})
    const guest = await userModel.findOne({email: 'guest@gmail.com'})
    const room = await roomModel.findOne({name: 'First room'})
    const d = new Date()
    if (user && room) {
        await messageModel.insertMany([
            {
                author: guest,
                content: 'this is first message to you.',
                type: 1, // in_room
                in_room: room,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: user,
                content: 'this is message 2 to you.',
                type: 1, // in_room
                in_room: room,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: guest,
                content: 'this is message 3 to you.',
                type: 1, // in_room
                in_room: room,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: user,
                content: 'this is message 4 to you.',
                type: 1, // in_room
                in_room: room,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: guest,
                content: 'this is message 5 to you.',
                type: 1, // in_room
                in_room: room,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: user,
                content: 'this is message 6 to you.',
                type: 1, // in_room
                in_room: room,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: guest,
                content: 'this is message 7 to you.',
                type: 1, // in_room
                in_room: room,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: guest,
                content: 'this is message 8 to you.',
                type: 1, // in_room
                in_room: room,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: user,
                content: 'this is message 9 to you.',
                type: 1, // in_room
                in_room: room,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: user,
                content: 'this is message 10 to you.',
                type: 1, // in_room
                in_room: room,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: guest,
                content: 'this is message 11 to you.',
                type: 1, // in_room
                in_room: room,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: user,
                content: 'this is message 12 to you.',
                type: 1, // in_room
                in_room: room,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: guest,
                content: 'this is message 13 to you.',
                type: 1, // in_room
                in_room: room,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: guest,
                content: 'this is message 14 to you.',
                type: 1, // in_room
                in_room: room,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: user,
                content: 'this is message 15 to you.',
                type: 1, // in_room
                in_room: room,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: guest,
                content: 'this is message 16 to you.',
                type: 1, // in_room
                in_room: room,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: guest,
                content: 'this is message 17 to you.',
                type: 1, // in_room
                in_room: room,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: guest,
                content: 'this is message 18 to you.',
                type: 1, // in_room
                in_room: room,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: guest,
                content: 'this is message 19 to you.',
                type: 1, // in_room
                in_room: room,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: guest,
                content: 'this is message 20 to you.',
                type: 1, // in_room
                in_room: room,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: guest,
                content: 'this is message 21 to you.',
                type: 1, // in_room
                in_room: room,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: guest,
                content: 'this is message 22 to you.',
                type: 1, // in_room
                in_room: room,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: guest,
                content: 'this is message 23 to you.',
                type: 1, // in_room
                in_room: room,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: user,
                content: 'this is message 24 to you.',
                type: 1, // in_room
                in_room: room,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: guest,
                content: 'this is message 25 to you.',
                type: 1, // in_room
                in_room: room,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: user,
                content: 'this is message 26 to you.',
                type: 1, // in_room
                in_room: room,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
        ])

        const message2 = await messageModel.findOne({content: 'this is message 2 to you.'})
        const message25 = await messageModel.findOne({content: 'this is message 25 to you.'})
        // insert children message
        await messageModel.insertMany([
            {
                author: user,
                content: 'this is message children 1.',
                type: 1, // in_room
                in_room: room,
                parent: message2,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: guest,
                content: 'this is message children 2.',
                type: 1, // in_room
                in_room: room,
                parent: message2,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: user,
                content: 'this is message children 3.',
                type: 1, // in_room
                in_room: room,
                parent: message2,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: guest,
                content: 'this is message children 4.',
                type: 1, // in_room
                in_room: room,
                parent: message25,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: guest,
                content: 'this is message children 5.',
                type: 1, // in_room
                in_room: room,
                parent: message25,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
            {
                author: user,
                content: 'this is message children 6.',
                type: 1, // in_room
                in_room: room,
                parent: message25,
                created_at: d.getTime(),
                updated_at: d.getTime()
            },
        ])

    }
}