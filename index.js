const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const path = require('path')
const session = require('express-session')
const UserModel = require('./models/user')
const varMiddleware = require('./middlewares/vairables')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add-course')
const coursesRoutes = require('./routes/courses')
const cartRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')

const app = express()

const hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs',
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
app.use( async (req, res, next) => {
	try {
		const user = await UserModel.findById('5f4544ab008f748f1a87e6ad')
		req.user = user
		next()
	} catch (error) {
		console.log(error)
	}
})
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
	secret: 'secret key',
	resave: false,
	saveUninitialized: false,
}))
app.use(varMiddleware)

app.use('/', homeRoutes)
app.use('/add-course', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 5000

async function start() {
	try {
		await mongoose.connect('mongodb+srv://vladyslav:Gy7GIqXa0ElqvUYw@cluster0.9ukjx.mongodb.net/NodeJS_Shop', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		const candidate = await UserModel.findOne()
		if(!candidate) {
			const user = new UserModel({
				name: 'vlad',
				email: 'vlad@gmail.com',
				cart: { items: [] }
			})

			await user.save()
		}
		app.listen(PORT, () => {
			console.log('Server is running on port', PORT);
		})
	} catch (e) {
		console.log(e)
	}

}

start()