var express = require('express')
var router = express.Router()
var userController = require('../controller/user')
let requiredAuth = require('../controller/auth/requiredAuth')
let validation = require('../controller/requestValidation')

router.post('/login', require('../controller/requestValidation/login'), userController.login)
router.post('/logout', requiredAuth(), userController.logout)
router.post('/get-token', userController.getToken)
router.get('/get-auth-user-info', requiredAuth(), userController.getAuthInfo)
router.get('/find-by-string', requiredAuth(), userController.findByString)
router.post('/account-update-info', [requiredAuth(), validation('./user/editAccount')], userController.editAccount)

module.exports = router