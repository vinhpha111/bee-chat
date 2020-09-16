const roomUserModel = require('../model/roomUser')
const roomModel = require('../model/room')
const mongoose = require('mongoose');

module.exports = {
    getRoomByUser: async (userId) => {
        let roomUserList = await roomUserModel.find({user: userId}).populate('room').exec()
        let rooms = []
        for (let i in roomUserList) {
            if (roomUserList[i].room) {
                rooms.push(roomUserList[i].room)
            }
        }
        return rooms
    },
    getRoomBySlug: async (slug) => {
        const room = await roomModel.findOne({slug})
        return room
    },
    getRoleInRoom: async (userId, roomId) => {
        const userWithRoom = await roomUserModel.findOne({user: userId, room: roomId})
        if (userWithRoom) {
            return userWithRoom.role
        }
        return null
    },
    create: async (data) =>{
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            let { userCreate, name, listUser } = data
            listUser = listUser.filter(id => id !== userCreate)
            listUser.push(userCreate)
            let slug = name.toLowerCase().replace(/\s/g, '_')
            if (await roomModel.count({slug}) !== 0) {
                slug = slug + '_' + (new Date()).getTime()
            }
            let room = await (new roomModel({
                name: name,
                slug: slug,
                user_creat: userCreate
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
            await roomUserModel.insertMany(userRoomData, {session})
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
    }
}