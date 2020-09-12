const messageRepository = require('../repository/message')
module.exports = {
    getMessageBySlugRoom: async (req, res) => {
        let messages = await messageRepository.getListMessageInRoom(req.body.slugRoom, req.body.query)
        return res.json(messages)
    }
}