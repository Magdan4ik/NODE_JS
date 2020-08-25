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

	console.log('req.user', req.user._id)

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