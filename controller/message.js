const messageRepository = require('../repository/message')
const { TYPE_EMOJI } =  require('../config/constants')

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
    }
}