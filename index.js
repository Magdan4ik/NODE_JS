const express = require('express')
const path = require('path')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./graphql/schema')
const resolver = require('./graphql/resolver')
const sequelize = require('./utils/db')
const app = express()

const PORT = process.env.port || 5000

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(graphqlHTTP({
	schema: schema,
	rootValue: resolver,
	graphiql: true,
}))
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