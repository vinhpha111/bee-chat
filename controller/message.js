const messageRepository = require('../repository/message')
const { TYPE_EMOJI } = require('../config/constants')

module.exports = {
  getMessageBySlugRoom: async (req, res) => {
    let messages = await messageRepository.getListMessageInRoom(req.body.slugRoom, req.body.query)
    return res.json(messages)
  },
  addEmojiByChar: async (req, res) => {
    let emoji = await messageRepository.addEmoji(req, TYPE_EMOJI.CHAR)
    return res.json(emoji)
  },
  removeEmoji: async (req, res) => {
    let emoji = await messageRepository.removeEmoji(req)
    return res.json(emoji)
  },
  getMessageById: async (req, res) => {
    let message = await messageRepository.getMessageById(req.query._id)
    return res.json(message)
  },
  editMessage: async (req, res) => {
    try {
      const id = req.body.id
      const content = req.body.content
      const message = await messageRepository.edit({ id, content })
      return res.json(message)
    } catch (error) {
      console.log(error)
      return res.status(500).send(error)
    }
  }
}
