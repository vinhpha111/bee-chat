const messageRepository = require('../repository/message')
module.exports = {
    getMessageBySlugRoom: async (req, res) => {
        let messages = await messageRepository.getListMessageInRoom(req.query.slugRoom)
        return res.json(messages)
    }
}