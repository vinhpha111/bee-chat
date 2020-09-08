module.exports = (req, res, next) => {
    let headerAuthorization = req.header('authorization')
    if (headerAuthorization && headerAuthorization.split(' ')[0]=== 'Bearer' && headerAuthorization.split(' ')[1]) {
        req.token = headerAuthorization.split(' ')[1]
    }
    return next()
}