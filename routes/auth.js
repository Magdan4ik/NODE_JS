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

router.post('/register', async (req, res) => {
	try {
		
		const { email, password, repeat, name } = req.body

		const candidate = await UserModel.findOne({email})

		if(candidate) {
			res.redirect('/auth/login#register')
		} else {
			const user = new UserModel({
				email,
				name,
				password,
				cart: {
					items: []
				}
			})

			await user.save()
			res.redirect('/auth/login#login')
		}
	} catch (error) {
		console.log(error)
	}
})

module.exports = router