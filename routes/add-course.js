const { Router } = require('express')
const router = Router()

router.get('/', (req, res) => {
	res.render('add-course', {
		title: 'Добавить курс',
		isAddCourse: true
	})
})

module.exports = router