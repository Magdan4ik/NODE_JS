module.exports = function(req, res, next) {
	if(req.session.isAuthenticated === false) {
		return res.redirect('/auth/login')
	}
	next()
}