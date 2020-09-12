var express = require('express')
var router = express.Router()
var MessageController = require('../controller/message')
let requiredAuth = require('../controller/auth/requiredAuth')

router.post('/get-message-by-slug-room', requiredAuth(), MessageController.getMessageBySlugRoom)

module.exports = router