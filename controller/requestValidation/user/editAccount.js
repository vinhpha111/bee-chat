const { body, validationResult } = require('express-validator');
const formidable = require('formidable')
const Jimp = require('jimp')

module.exports = [
    // upload avatar if exist
    async (req, res, next) => {
        const form = formidable({
            multiples: true,
            uploadDir: `${__dirname}/../../../upload/avatar`,
            maxFileSize: 1024 * 1024 * 2
        })
        let errors = []
        form.onPart = function (part) {
            if ((part.name === 'avatar' && ['image/png', 'image/jpeg', 'image/pjpeg'].indexOf(part.mime) !== -1) ||
                ['fullname', 'email', 'password', 'new_password', 'new_password_confirm'].indexOf(part.name) !== -1) {
                form.handlePart(part);
            } else {
                errors.push({
                    param: 'avatar',
                    msg: 'validation.avatar_not_valid'
                })
            }
        }
        await new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    errors.push({
                        param: 'avatar',
                        msg: err.toString()
                    })
                    reject(err)
                }
                req.errors = errors
                for (let key in fields) {
                    req.body[key] = fields[key]
                }
                for (let key in files) {
                    await Jimp.read(files[key].path)
                        .then(lenna => {
                            return lenna
                                .resize(120, Jimp.AUTO) // resize
                                .quality(60) // set JPEG quality
                                .write(files[key].path) // save
                        })
                        .catch(err => {
                            console.error(err)
                        });
                    req.body[key] = files[key].path
                }
                resolve()
            })
        })
        return next()
    },

    body('fullname').not().isEmpty().withMessage('validation.empty')
        .isLength({max: 20}).withMessage('validation.max_length')
        .optional({
            nullable: true
        }),
    body('email').isEmail().withMessage('validation.email')
        .isLength({max: 20}).withMessage('validation.max_length')
        .optional({
            checkFalsy: true
        }),
    body('password').notEmpty().withMessage('validation.empty')
        .optional({
            nullable: true
        }),
    body('new_password').notEmpty().withMessage('validation.empty')
        .optional({
            nullable: true
        }),
    body('new_password_confirm').notEmpty().withMessage('validation.empty')
        .custom((value, {req}) => {
            if (value !== req.body.new_password) {
                throw new Error('validation.pass_confirm_not_correct')
            }
            return true
        })
        .optional({
            nullable: true
        }),

    (req, res, next) => {
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