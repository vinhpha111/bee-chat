var express = require('express')
var router = express.Router()
const userRouter = require('./user')

// get token of user
router.use(require('../controller/requestValidation/getToken'))
// verify user from token header
router.use(require('../controller/requestValidation/verifyUserByToken'))

router.use('/user', userRouter)

module.exports = router