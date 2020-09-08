module.exports = (arrAuth = []) => {
    return (req, res, next) => {
        if (!req.userInfo || (arrAuth.length !== 0 && arrAuth.indexOf(req.userInfo.role) === -1)) {
            return res.status(403).send('unauthorization')
        }
        return next()
    }
}