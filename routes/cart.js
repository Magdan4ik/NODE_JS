const { Router } = require('express')
const CartModel = require('../models/cart')
const CourseModel = require('../models/course')
const Cart = require('../models/cart')

const router = Router()

router.post('/add', async (req, res) => {
	const course = await CourseModel.getById(req.body.id)
	await Cart.add(course)
	res.redirect('/cart')
})

router.get('/', async (req, res) => {
	const cart = await Cart.fetch()
	res.render('cart', {
		title: 'Корзина',
		isCart: true,
		courses: cart.courses,
		price: cart.pricer
	})
})

module.exports = router