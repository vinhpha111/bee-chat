const { body, validationResult } = require('express-validator');
const userRepository = require('../../repository/user')

module.exports = [
    body('email')
        .notEmpty().withMessage('Empty')
        .isEmail().withMessage('must email'),
    body('password')
        .notEmpty().withMessage('Empty'),
    body('not_exist_user')
        .custom(async (value) => {
            if (await !userRepository.checkEmailExist(value)) {
                throw new Error('user_or_password_not_exist')
            }
            return true
        }),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }
        return next()
    }
]