module.exports = (req, res, next) => {
    if(!req.session.isAuth) {
        return req.redirect ("/account/login");
    }
    next();
}