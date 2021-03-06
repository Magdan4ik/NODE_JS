const UserModel = require('../models/user')

module.exports = async function(req, res, next) {
	if(!req.session.user) {
		return next()
	} else {
		req.user = await UserModel.findById(req.session.user._id)
		return next();
	}

}