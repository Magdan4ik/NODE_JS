const { body } = require('express-validator/check')
const UserModel = require('../models/user')

exports.registerValidators = [
	body('email', 'Введите корректный email')
		.isEmail()
		.custom(async (value) => {
			try {
				const user = await UserModel.findOne({email: value})

				if(user) {
					return Promise.reject('Такой email уже занят')
				}
			} catch (error) {
				console.log(error)
			}
		})
		.normalizeEmail(),
	body('name', 'Имя должно состоять минимум из 3-х символов')
		.isLength({min: 3})
		.trim(),
	body('password', 'Пароль должен состоять минимум из 6-и символов')
		.isLength({min: 6, max: 56})
		.isAlphanumeric()
		.trim(),
	body('repassword')
		.custom((value, {req}) => {
			if(value !== req.body.password) {
				throw new Error('Пароли должны совпадать')
			}
			return true
		})
		.trim()
]