const { Router, json } = require('express')
const CourseModel = require('../models/course');
const router = Router()

router.get('/', async (req, res) => {
	const courses = await CourseModel.find().lean() //найти все записи (lean нужен для handlebars)

	res.render('courses', {
		title: 'Курсы',
		isCourses: true,
		courses
	})
})

router.get('/:id', async (req, res) => {
	const course = await CourseModel.findById(req.params.id).lean()
	res.render('course', {
		layout: 'empty',
		title: 'Курс ' + course.title,
		course
	})
})

router.get('/:id/edit', async (req, res) => {
	if(!req.query.allow) {
		return res.redirect('/')
	} 

	const course = await CourseModel.findById(req.params.id).lean()

	res.render('course-edit', {
		title: 'Редактировать ' + course.title,
		course
	})
})

router.post('/edit', async (req, res) => {
	await CourseModel.findByIdAndUpdate(req.body.id, req.body).lean()
	res.redirect('/courses')
})

module.exports = router