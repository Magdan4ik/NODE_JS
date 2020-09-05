const keys = require('../keys')

module.exports = function(email) {
	return {
		to: email,
		from: keys.EMAIL_FROM,
		subject: 'Аккаунт создан', 
		html: `
			<h1>ДОбро пожаловать !</h1>
			<p>Ваш аккаунт успешно создан! Email - ${email}</p>
			<br />
			<a href="${keys.SITE_URL}">Магазин курсов</a>
		`
	}
}