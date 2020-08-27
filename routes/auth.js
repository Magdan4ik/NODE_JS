const { Router } = require('express')
const UserModel = require('../models/user')

const router = Router()

router.get('/login', async (req, res) => {
	res.render('auth/login', {
		title: 'Авторизация',
		isLogin: true,
	})
})

router.post('/login', async (req, res) => {

	const user = await UserModel.findById('5f4544ab008f748f1a87e6ad')

	req.session.user = user
	req.session.isAuthenticated = true
	req.session.save(err => {
		if(err) {
			throw err
		} else {
			res.redirect('/')
		}
	})
})

router.get('/logout', async (req, res) => {
	req.session.destroy(() => {
		res.redirect('/auth/login#login')
	})
})

module.exports = router