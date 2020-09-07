const keys = require('../keys')

module.exports = function(email, token) {
	return {
		to: email,
		from: keys.EMAIL_FROM,
		subject: 'Восстановление доступа в аккаунт', 
		html: `
			<h1>Вы забыли пароль?</h1>
			<p>Если нет, то проигнорируйте даное письмо.</p>
			<p>Иначе, нажмите на ссылку ниже:</p>
			<p><a href="${keys.SITE_URL}/auth/password/${token}">Восстановить доступ</a></p>
			<br />
			<a href="${keys.SITE_URL}">Магазин курсов</a>
		`
	}
}