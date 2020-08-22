const express = require('express')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add-course')
const coursesRoutes = require('./routes/courses')

const app = express()

const hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs',
})

app.use('/', homeRoutes)
app.use('/add-courses', addRoutes)
app.use('/courses', coursesRoutes)

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
app.use(express.static('public'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
	console.log('Server is running on port', PORT);
	
})