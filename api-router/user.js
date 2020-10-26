var express = require('express')
var router = express.Router()
var userController = require('../controller/user')
let requiredAuth = require('../controller/auth/requiredAuth')

router.post('/login', require('../controller/requestValidation/login'), userController.login)
router.post('/logout', requiredAuth(), userController.logout)
router.post('/get-token', userController.getToken)
router.get('/get-auth-user-info', requiredAuth(), userController.getAuthInfo)
router.get('/find-by-string', requiredAuth(), userController.findByString)

module.exports = router