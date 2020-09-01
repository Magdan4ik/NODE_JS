const { Router } = require('express')
const UserModel = require('../models/user')
const keys = require('../keys')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const regEmail = require('../emails/register')

const router = Router()
const transporter = nodemailer.createTransport(
	sendgrid({
		auth: { api_key: keys.SENDGRID_API_KEY }
	})
)

router.get('/login', async (req, res) => {
	res.render('auth/login', {
		title: 'Авторизация',
		isLogin: true,
		loginError: req.flash('loginError'),
		registerError: req.flash('registerError'),
	})
})

router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body
		const candidate = await UserModel.findOne({ email })

		if (candidate) {
			const validPass = await bcrypt.compare(password, candidate.password)

			if (validPass) {
				req.session.user = candidate
				req.session.isAuthenticated = true
				req.session.save(err => {
					if (err) {
						throw err
					}
					res.redirect('/')
				})
			} else {
				req.flash('loginError', 'Неверный пароль')
				res.redirect('/auth/login#login')
			}
		} else {
			req.flash('loginError', 'Такого пользователя не существует')
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
		const { email, password, name } = req.body
		const candidate = await UserModel.findOne({email})

		if(candidate) {
			req.flash('registerError', 'Пользователь с таким email уже существует')
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
			await transporter.sendMail(regEmail(email))
		}
	} catch (error) {
		console.log(error)
	}
})

module.exports = router