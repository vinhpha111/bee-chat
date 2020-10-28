const { body, validationResult } = require('express-validator');
const formidable = require('formidable')

module.exports = [
    // upload avatar if exist
    (req, res, next) => {
        const form = formidable({
            multiples: true,
            uploadDir: `${__dirname}/../../../upload/avatar`,
            maxFileSize: 1024 * 1024
        })
        let errors = []
        form.onPart = function (part) {
            console.log(part)
            if ((part.name === 'avatar' && ['image/png', 'image/jpeg', 'image/pjpeg'].indexOf(part.mime) !== -1) ||
                ['fullname', 'email', 'password', 'new_password', 'new_password_confirm'].indexOf(part.name) !== -1) {
                form.handlePart(part);
            } else {
                errors.push({
                    param: 'avatar',
                    msg: 'File is invalid'
                })
            }
        }
        form.parse(req, (err, fields, files) => {
            if (err) {
                errors.push({
                    param: 'avatar',
                    msg: err.toString()
                })
                return next()
            }
            req.errors = errors
            console.log({
                fields,
                files
            })
            for (let key in fields) {
                req.body[key] = fields[key]
            }
            for (let key in files) {
                req.body[key] = files[key].path
            }
            return next()
        })
    },

    body('email').isEmail().withMessage('must email').optional({
        checkFalsy: true
    }),

    (req, res, next) => {
        console.log(req.errors)
        let errors = validationResult(req)
        if (!errors.isEmpty() || req.errors.length) {
            errors = errors.array().concat(req.errors)
            return res.status(422).json({
                errors: errors
            })
        }
        return next()
    }
]