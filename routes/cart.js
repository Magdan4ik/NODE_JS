const { Router } = require('express')
const CartModel = require('../models/cart')
const CourseModel = require('../models/course')

const router = Router()

router.post('/add', async (req, res) => {
	const course = await CourseModel.getById(req.body.id)
	await CartModel.add(course)
	res.redirect('/cart')
})

router.delete('/remove/:id', async(req, res) => {
	const cart = await CartModel.remove(req.params.id)
	res.status(200).json(cart)
})

router.get('/', async (req, res) => {
	const cart = await CartModel.fetch()
	res.render('cart', {
		title: 'Корзина',
		isCart: true,
		courses: cart.courses,
		price: cart.price
	})
})

module.exports = router