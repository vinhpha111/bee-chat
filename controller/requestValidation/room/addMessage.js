const { body, validationResult } = require('express-validator');

module.exports = [
    body('content')
        .notEmpty().withMessage('Empty'),
    body('roomId')
        .notEmpty().withMessage('Empty'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }
        return next()
    }
]