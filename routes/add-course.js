const { Router } = require('express')
const CourseModel = require('../models/course');
const authMiddleware = require('../middlewares/auth')
const router = Router()


router.get('/', authMiddleware, (req, res) => {
	res.render('add-course', {
		title: 'Добавить курс',
		isAddCourse: true
	})
})

router.post('/', authMiddleware, async (req, res) => {

	const { title, price, img } = req.body

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