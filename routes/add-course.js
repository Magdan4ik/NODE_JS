const { Router } = require('express')
const CourseModel = require('../models/course');
const router = Router()


router.get('/', (req, res) => {
	res.render('add-course', {
		title: 'Добавить курс',
		isAddCourse: true
	})
})

router.post('/', async (req, res) => {

	const { title, price, img } = req.body
	
	const course = new CourseModel(title, price, img)
	await course.save()

	res.redirect('/courses')
})

module.exports = router