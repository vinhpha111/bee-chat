var express = require('express')
var router = express.Router()
var userController = require('../controller/user')
let userAuth = require('../controller/requestValidation/authUser')

router.post('/login', require('../controller/requestValidation/login'), userController.login)
router.get('/get-auth-user-info', userAuth, userController.getAuthInfo)

module.exports = router