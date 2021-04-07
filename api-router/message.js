var express = require('express')
var router = express.Router()
var MessageController = require('../controller/message')
let requiredAuth = require('../controller/auth/requiredAuth')

router.post('/get-message-by-slug-room', requiredAuth(), MessageController.getMessageBySlugRoom)
router.post('/add-emoji-by-char', requiredAuth(), MessageController.addEmojiByChar)
router.post('/remove-emoji', requiredAuth(), MessageController.removeEmoji)
router.get('/get-by-id', requiredAuth(), MessageController.getMessageById)
router.post('/edit-message', requiredAuth(), MessageController.editMessage)
router.delete('/:id/remove-notify', requiredAuth(), MessageController.removeNotify)
router.delete('/:id', requiredAuth(), MessageController.remove)

module.exports = router