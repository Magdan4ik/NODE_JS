const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const csrf = require('csurf')
const flash = require('connect-flash')
const path = require('path')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const varMiddleware = require('./middlewares/vairables')
const userMiddleware = require('./middlewares/user')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add-course')
const coursesRoutes = require('./routes/courses')
const cartRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')

const MONGO_DB_URI = 'mongodb+srv://vladyslav:Gy7GIqXa0ElqvUYw@cluster0.9ukjx.mongodb.net/NodeJS_Shop'
const app = express()

const mongoStore = new MongoStore({
	collection: 'sessions',
	uri: MONGO_DB_URI,
})

const hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs',
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
	secret: 'secret key',
	resave: false,
	saveUninitialized: false,
	store: mongoStore
}))
app.use(csrf()) //csrf защита
app.use(flash()) //сообщения об ошибках
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes)
app.use('/add-course', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 5000

async function start() {
	try {
		await mongoose.connect(MONGO_DB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		app.listen(PORT, () => {
			console.log('Server is running on port', PORT);
		})
	} catch (e) {
		console.log(e)
	}

}

start()