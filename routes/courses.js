const { Router } = require('express')
const CourseModel = require('../models/course');
const router = Router()

router.get('/', async (req, res) => {
	
	const courses = await CourseModel
		.find() // .find() найти все записи 
		.lean() // .lean() возвращает только простые объекты
		.populate('userId', 'email name')  // populate (связывает модель Пользователя и вставляет данные по ключу userId) + указываем что нужно достать с userId 
		.select('price title img') //указываем какие поля достать

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

router.post('/remove', async (req, res) => {
	try {
		await CourseModel.deleteOne({_id: req.body.id})
		res.redirect('/courses')
	} catch (error) {
		console.log(error)
	}

})

module.exports = router