const { Router } = require('express')
const { validationResult } = require('express-validator/check')
const { registerValidators } = require('../helpers/validators')
const UserModel = require('../models/user')
const keys = require('../keys')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const regEmail = require('../emails/register')
const resEmail = require('../emails/reset')

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

router.post('/register', registerValidators, async (req, res) => {
	try {
		const { email, password, repassword, name } = req.body
		const candidate = await UserModel.findOne({email})

		const errors = validationResult(req)

		if(!errors.isEmpty()) {
			req.flash('registerError', errors.array()[0].msg)
			return res.status(422).redirect('/auth/login#register')
		}

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

router.get('/reset', (req, res) => {
	res.render('auth/reset', {
		title: 'Забыли пароль',
		error: req.flash('error')
	})
})

router.post('/reset', (req, res) => {
	try {
		crypto.randomBytes(32, async (err, buffer) => {
			if(err) {
				req.flash('error', 'Что-то пошло не так, повторите попытку позже!')
				return res.redirect('/auth/reset')
			}

			const token = buffer.toString('hex')
			const candidate = await UserModel.findOne({email: req.body.email})

			if(candidate) {
				candidate.resetToken = token
				candidate.resetTokenExp = Date.now() + 60 * 60 * 1000 // 1 час
				await candidate.save()
				await transporter.sendMail(resEmail(candidate.email, token))
				res.redirect('/auth/login')
			} else {
				req.flash('error', 'Такого email нет')
				return res.redirect('/auth/reset')
			}
		})
	} catch (error) {
		console.log(error)
	}
})

router.get('/password/:token', async (req, res) => {
	if(!req.params.token) {
		return res.redirect('/auth/login')
	}
	try {
		const user = await UserModel.findOne({
			resetToken: req.params.token,
			resetTokenExp: {$gt: Date.now()}
		})

		if(!user) {
			return res.redirect('/auth/login')
		} else {
			res.render('auth/password', {
				title: 'Восстановить пароль',
				userId: user._id.toString(),
				token: req.params.token,
				error: req.flash('error')
			})
		}

	} catch (error) {
		console.log(error)
	}
})

router.post('/password', async (req, res) => {
	try {
		const user = await UserModel.findOne({
			_id: req.body.userId,
			resetToken: req.body.token,
			resetTokenExp: {$gt: Date.now()}
		})

		if(user) {
			user.password = await bcrypt.hash(req.body.password, 10)
			user.resetToken = undefined
			user.resetTokenExp = undefined
			await user.save()
			res.redirect('/auth/login')
		} else {
			req.flash('loginError', 'Время жизни токена истекло')
			res.redirect('/auth/login')
		}
	} catch (error) {
		console.log(error);
		
	}
})



module.exports = router