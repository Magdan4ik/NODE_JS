
const toCurrency = price => {
	return 	new Intl.NumberFormat('ru-RU', {
		currency: 'rub',
		style: 'currency'
	}).format(price)
}

const toDate = date => {
	return new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	}).format(new Date(date))
}

document.querySelectorAll('.course-price').forEach(node => {
	node.textContent = toCurrency(node.textContent)
})
document.querySelectorAll('.js-date').forEach(node => {
	node.textContent = toDate(node.textContent)
})

window.cart = {

	container: document.getElementById('cart'),

	async removeCourse(id) {
		const res = await fetch('/cart/remove/' + id, {
			method: 'delete',
		})
		const cart = await res.json()

		this.updateHTML(cart)
	},

	updateHTML(cart) {
		if(cart.courses.length) {
			const html = cart.courses.map(c => {
				return `
					<tr>
						<td>${c.title}</td>
						<td>${c.count}</td>
						<td>
							<button type="button" class="btn btn-small grey darken-4" onclick="window.cart.removeCourse('${c._id}')">
								<i class="material-icons">close</i>
							</button>
						</td>
					</tr>
				`
			}).join(' ')

			this.container.querySelector('tbody').innerHTML = html
			this.container.querySelector('.course-price').textContent = toCurrency(cart.price)
	
		} else {
			this.container.innerHTML = '<p>Корзина пуста</p>'
		}
	}
}


M.Tabs.init(document.querySelectorAll('.tabs'), {});