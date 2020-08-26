function mapCartItems(cart) {
	return cart.items.map(c => ({
		...c.courseId._doc,
		count: c.count
	}))
}

function getTotalPrice(courses) {
	return courses.reduce((total, course) => {
		return total += course.price * course.count
	}, 0)
}

module.exports = {
	mapCartItems,
	getTotalPrice
}

