const { Router } = require('express')
const CourseModel = require('../models/course')
const CartHelper = require('../helpers/cart')

const router = Router()

router.post('/add', async (req, res) => {
	const course = await CourseModel.findById(req.body.id)
	await req.user.addToCart(course)
	res.redirect('/cart')
})

router.delete('/remove/:id', async(req, res) => {
	const cart = await CartModel.remove(req.params.id)
	res.status(200).json(cart)
})

router.get('/', async (req, res) => {

	const user = await req.user
		.populate('cart.items.courseId')
		.execPopulate()

	const courses = CartHelper.mapCartItems(user.cart)

	res.render('cart', {
		title: 'Корзина',
		isCart: true,
		courses,
		price: CartHelper.getTotalPrice(courses)
	})
})

module.exports = router