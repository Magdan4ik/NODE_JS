const express = require('express')
const path = require('path')
const sequelize = require('./utils/db')
const todoRoutes = require('./routes/todo')
const app = express()

const PORT = process.env.port || 5000

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use('/api/todo', todoRoutes)
app.use((req, res, next) => {
	res.sendFile('/index.html')
})

async function start() {
	try {
		await sequelize.sync()
	} catch(e) {
		console.log(e)
	}
}

start()

app.listen(PORT)