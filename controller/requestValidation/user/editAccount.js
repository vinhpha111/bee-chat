const { body, validationResult } = require('express-validator');
const userRepository = require('../../../repository/user')

module.exports = [
    body('email').not().isEmail().withMessage('must email'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }
        return next()
    }
]