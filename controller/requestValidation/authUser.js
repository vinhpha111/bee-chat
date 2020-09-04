module.exports = (req, res, next) => {
    if (!req.userInfo) {
        return res.status(403).send('unauthorization')
    }
    return next()
}