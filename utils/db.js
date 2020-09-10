const Sequelize = require('sequelize')

const DB_HOST = 'sql7.freesqldatabase.com'
const DB_NAME = 'sql7364676'
const USER_NAME = 'sql7364676'
const PASSWORD = 'YZKlYSZW66'

const sequelize = new Sequelize(DB_NAME, USER_NAME, PASSWORD, {
	host: DB_HOST,
	dialect: 'mysql'
})

module.exports = sequelize