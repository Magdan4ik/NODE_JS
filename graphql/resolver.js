const TodoModel = require('../models/todo')

module.exports = {
	async getTodos() {
		try {
			return await TodoModel.findAll()
		} catch (error) {
			throw new Error('Fetch todos is not available')
		}
	},
	async createTodo({todo}) {
		try {
			return await TodoModel.create({
				title: todo.title,
				done: false
			})
		} catch (e) {
			throw new Error('Title is req')
		}
	},
	async completeTodo({id}) {
		try {
			const todo = await TodoModel.findByPk(id)
			todo.done = true
			await todo.save()
			return todo
		} catch (error) {
			throw new Error('Id is req for complete')
		}
	},
	async deleteTodo({id}) {
		try {
			const todo = await TodoModel.findByPk(id)
			await todo.destroy()
			return true
		} catch (error) {
			throw new Error('Id is req for del')
		}
	},
}