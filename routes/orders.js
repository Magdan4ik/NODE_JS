const { Router } = require('express')
const orderModel = require('../models/order')
const cartHelper = require('../helpers/cart')

const router = Router()

router.get('/', async (req, res) => {
	try {
		let orders = await orderModel
			.find({'user.userId': req.user._id})
			.populate('user.userId')
			.lean()
	
		orders = orders.map(o => {
			return {
				...o,
				price: o.courses.reduce((total, c) => {
					return total += c.count * c.course.price
				}, 0)
			}
		})

		res.render('orders', {
			title: "Заказы",
			isOrder: true,
			orders
		})
	} catch (error) {
		console.log(error)
	}
})

router.post('/', async (req, res) => {
	try {
		const user = await req.user
			.populate('cart.items.courseId')
			.execPopulate()
		const courses = user.cart.items.map(i => ({
			count: i.count,
			course: {...i.courseId._doc}
		}))
		const order = new orderModel({
			user: {
				name: req.user.name,
				userId: req.user
			},
			courses
		})
		await order.save()
		await req.user.clearCart()

		res.redirect('/orders')

	} catch (error) {
		console.log(error)
	}
	
})

module.exports = router