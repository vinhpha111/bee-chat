var express = require('express')
var router = express.Router()
const userRouter = require('./user')
const roomRouter = require('./room')

// get token of user
router.use(require('../controller/auth/getToken'))
// verify user from token header
router.use(require('../controller/auth/verifyUserByToken'))

router.use('/user', userRouter)
router.use('/room', roomRouter)

module.exports = router