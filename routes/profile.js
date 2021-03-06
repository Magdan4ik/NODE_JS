const { Router } = require('express')
const UserModel = require('../models/user')
const auth = require('../middlewares/auth')

const router = Router()

router.get('/', async (req, res) => {
	res.render('profile', {
		title: 'Профиль',
		isProfile: true,
		user: req.user.toObject()
	})
})

router.post('/', auth, async (req, res) => {
	try {
		const user = await UserModel.findById(req.user._id)
		
		const toChange = {
			name: req.body.name
		}

		if(req.file) {
			toChange.avatarUrl = req.file.path
		}

		Object.assign(user, toChange)
		await user.save()
		res.redirect('/profile')
	} catch (error) {
		console.log(error)
	}
})

module.exports = router