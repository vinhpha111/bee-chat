var express = require('express')
var router = express.Router()
var roomController = require('../controller/room')
let requiredAuth = require('../controller/auth/requiredAuth')
let requiredAuthInRoom = require('../controller/auth/requiredAuthInRoom')
const addMessageRequest = require('../controller/requestValidation/room/addMessage')

router.get('/get-list-room-by-user', requiredAuth(), roomController.getListByUser)
router.get('/get-role', requiredAuth(), roomController.getRoleInRoom)
router.post('/add', requiredAuth(), roomController.add)
router.post('/addMessage', addMessageRequest, requiredAuthInRoom(), roomController.addMessage)

module.exports = router