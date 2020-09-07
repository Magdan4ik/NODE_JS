const { Router } = require('express')
const CourseModel = require('../models/course')
const authMiddleware = require('../middlewares/auth')
const CartHelper = require('../helpers/cart')

const router = Router()



router.post('/add', authMiddleware, async (req, res) => {
	const course = await CourseModel.findById(req.body.id)
	await req.user.addToCart(course)
	res.redirect('/cart')
})

router.delete('/remove/:id', authMiddleware, async(req, res) => {
	await req.user.removeFromCart(req.params.id)

	const user = await req.user
		.populate('cart.items.courseId')
		.execPopulate()
	
	const courses = CartHelper.mapCartItems(user.cart)
	const cart = {
		courses,
		price: CartHelper.getTotalPrice(courses)
	}

	res.status(200).json(cart)
})

router.get('/', authMiddleware, async (req, res) => {

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