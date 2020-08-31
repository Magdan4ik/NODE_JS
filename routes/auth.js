const { Router } = require('express')
const bcrypt = require('bcryptjs')
const UserModel = require('../models/user')


const router = Router()

router.get('/login', async (req, res) => {
	res.render('auth/login', {
		title: 'Авторизация',
		isLogin: true,
	})
})

router.post('/login', async (req, res) => {

	try {
		const { email, password } = req.body
		const candidate = await UserModel.findOne({email})

		if(candidate) {

			const validPass = await bcrypt.compare(password, candidate.password)
			
			if(validPass) {
				req.session.user = candidate
				req.session.isAuthenticated = true
				req.session.save(err => {
					if(err) {
						throw err
					} else {
						res.redirect('/')
					}
				})
			} else {
				res.redirect('/auth/login#login')
			}
		} else {
			res.redirect('/auth/login#login')
		}
	} catch (error) {
		console.log(error)
	}
})

router.get('/logout', async (req, res) => {
	req.session.destroy(() => {
		res.redirect('/auth/login#login')
	})
})

router.post('/register', async (req, res) => {
	try {
		
		const { email, password, repassword, name } = req.body

		if(password !== repassword) {
			res.redirect('/auth/login#register')
		}

		const candidate = await UserModel.findOne({email})

		if(candidate) {
			res.redirect('/auth/login#register')
		} else {
			const hashPass = await bcrypt.hash(password, 10)
			const user = new UserModel({
				email,
				name,
				password: hashPass,
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