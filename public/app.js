document.querySelectorAll('.course-price').forEach(node => {
	node.textContent = new Intl.NumberFormat('ru-RU', {
		currency: 'rub',
		style: 'currency'
	}).format(node.textContent)
})

window.cart = {
	async removeCourse(id) {
		const res = await fetch('/cart/remove/' + id, {
			method: 'delete',
		})
		const cart = await res.json()
		return console.log(cart)
	}
}
