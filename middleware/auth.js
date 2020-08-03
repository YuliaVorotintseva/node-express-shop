module.exports = function (request, response, next) {
    if(!request.session.isAuthenticated) response.redirect('/auth/login')
    next()
}