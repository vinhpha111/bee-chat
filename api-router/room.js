var express = require('express')
var router = express.Router()
var roomController = require('../controller/room')
let requiredAuth = require('../controller/auth/requiredAuth')

router.get('/get-list-room-by-user', requiredAuth(), roomController.getListByUser)
router.get('/get-role', requiredAuth(), roomController.getRoleInRoom)
router.post('/add', requiredAuth(), roomController.add)

module.exports = router