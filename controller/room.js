const roomRepository = require('../repository/room')
const messageRepository = require('../repository/message')
module.exports = {
  getRoomBySlug: async (req, res) => {
    try {
      const room = await roomRepository.getRoomBySlug(req.params.slug)
      if (!room) {
        return res.status(404).send("cannot found")
      }
      return res.json(room)
    } catch (error) {
      console.log(`controller/room/getRoomBySlug: ${error}`)
      return res.status(500).send(error)
    }
  },
  getContactBySlug: async (req, res) => {
    try {
      const contact = await roomRepository.getContactBySlug(req.params.slug, req.userInfo)
      if (!contact) {
        return res.status(404).send("cannot found")
      }
      return res.json(contact)
    } catch (error) {
      console.log(`controller/room/getContactBySlug: ${error}`)
      return res.status(500).send(error)
    }
  },
  getListByUser: async (req, res) => {
    return res.json(await roomRepository.getRoomByUser(req.userInfo._id))
  },
  getListContactByUser: async (req, res) => {
    const userId = req.userInfo._id
    try {
      const listContact = await roomRepository.getListContactByUser(userId)
      return res.json(listContact)
    } catch (error) {
      return res.status(500).send(error)
    }
  },
  getRoleInRoom: async (req, res) => {
    const roomSlug = req.query.roomSlug
    if (!roomSlug) {
      return res.status(404).send('cannot found')
    }
    const room = await roomRepository.getRoomBySlug(roomSlug)
    if (!room) {
      return res.status(404).send('cannot found')
    }
    const role = await roomRepository.getRoleInRoom(req.userInfo._id, room._id)
    if (!role) {
      return res.status(404).send('cannot found')
    }
    return res.json(role)
  },
  add: async (req, res) => {
    const userCreate = req.userInfo._id
    const name = req.body.name
    const listUser = req.body.userList
    const room = await roomRepository.create({ name, listUser, userCreate })
    if (room) {
      return res.json(room)
    }
    return res.status(500).send('Error')
  },
  addMessage: async (req, res) => {
    const message = await messageRepository.addMessageInRoom(req)
    if (message) {
      return res.json(message)
    }
    return res.status(500).send('Error')
  },
  findOrCreatetRoomContact: async (req, res) => {
    const fromUser = req.userInfo._id
    const toUser = req.query.toUser
    try {
      const roomContact = await roomRepository.findOrCreateRoomContact(fromUser, toUser)
      if (roomContact) {
        return res.json(roomContact)
      }
      throw "Controller/room.js/findOrCreateRoomContact: Empty room contact"
    } catch (error) {
      return res.status(500).send(error)
    }
  },
  setVisibleRoomForUser: async (req, res) => {
    const userId = req.userInfo._id
    const roomId = req.query.room_id
    const visible = req.query.visible || true
    const roomUser = await roomRepository.setVisibleRoomForUser(roomId, userId, visible)
    if (roomUser) {
      return res.json(roomUser)
    }
    return res.status(500).send('Has error')
  }
}