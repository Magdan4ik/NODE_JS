const { body } = require('express-validator/check')

exports.registerValidators = [
	body('email', 'Введите корректный email').isEmail(),
	body('name', 'Имя должно состоять минимум из 3-х символов').isLength({min: 3}),
	body('password', 'Пароль должен состоять минимум из 6-и символов').isLength({min: 6, max: 56}).isAlphanumeric(),
	body('repassword').custom((value, {req}) => {
		if(value !== req.body.password) {
			throw new Error('Пароли должны совпадать')
		}
		return true
	})
]