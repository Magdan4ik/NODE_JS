const { Router } = require('express')
const { validationResult } = require('express-validator')
const CourseModel = require('../models/course');
const authMiddleware = require('../middlewares/auth')
const { courseValidators } = require('../helpers/validators')
const router = Router()


router.get('/', authMiddleware, (req, res) => {
	res.render('add-course', {
		title: 'Добавить курс',
		isAddCourse: true
	})
})

router.post('/', authMiddleware, courseValidators, async (req, res) => {

	const { title, price, img } = req.body

	const errors = validationResult(req)

	if(!errors.isEmpty()) {
		return res.status(422).render('add-course', {
			title: 'Добавить курс',
			isAddCourse: true,
			error: errors.array()[0].msg,
			data: {
				title, 
				price, 
				img,
			}
		})
	}

	const course = new CourseModel({
		title, 
		price, 
		img,
		userId: req.user._id
	})

	try {
		await course.save()
		res.redirect('/courses')
	} catch (error) {
		console.log(err)
	}

})

module.exports = router