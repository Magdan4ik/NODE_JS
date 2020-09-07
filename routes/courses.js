const { Router } = require('express')
const { validationResult } = require('express-validator')
const { courseValidators } = require('../helpers/validators')
const CourseModel = require('../models/course');
const authMiddleware = require('../middlewares/auth')
const router = Router()

router.get('/', async (req, res) => {
	try {
		const courses = await CourseModel
			.find() // .find() найти все записи 
			.lean() // .lean() возвращает только простые объекты
			.populate('userId', 'email name')  // populate (связывает модель Пользователя и вставляет данные по ключу userId) + указываем что нужно достать с userId 
			.select('price title img') //указываем какие поля достать
	
		res.render('courses', {
			title: 'Курсы',
			isCourses: true,
			userId: req.user ? req.user._id.toString() : null,
			courses
		})
	} catch (error) {
		console.log(error)
	}
})

router.get('/:id', async (req, res) => {
	try {
		const course = await CourseModel.findById(req.params.id).lean()
		res.render('course', {
			layout: 'empty',
			title: 'Курс ' + course.title,
			course
		})
	} catch (error) {
		console.log(error)
	}
})

router.get('/:id/edit', authMiddleware, async (req, res) => {

	if(!req.query.allow) {
		return res.redirect('/')
	} 

	try {
		const course = await CourseModel.findById(req.params.id).lean()

		if(course.userId.toString() !== req.user._id.toString()) {
			return res.redirect('/courses')
		}

		res.render('course-edit', {
			title: 'Редактировать ' + course.title,
			course
		})
	} catch (error) {
		console.log(error)
	}
})

router.post('/edit', authMiddleware, courseValidators, async (req, res) => {

	const errors = validationResult(req)

	if(!errors.isEmpty()) {
		return res.status(422).redirect(`/courses/${id}/edit?allow=true`)
	}

	try {
		const course = await CourseModel.findById(req.body.id)

		if(course.userId.toString() !== req.user._id.toString()) {
			return res.redirect('/courses')
		}

		Object.assign(course, req.body)
		await course.save()
		res.redirect('/courses')
	} catch (error) {
		console.log(error)
	}

})

router.post('/remove', authMiddleware, async (req, res) => {
	try {
		await CourseModel.deleteOne({
			_id: req.body.id,
			userId: req.user._id
		})
		res.redirect('/courses')
	} catch (error) {
		console.log(error)
	}
})

module.exports = router