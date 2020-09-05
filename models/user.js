const {Schema, model} = require('mongoose')

const user = new Schema({
	email: {
		type: String,
		required: true
	},
	name: {
		type: String,
	},
	password: {
		type: String,
		required: true
	},
	resetToken: {
		type: String
	},
	resetTokenExp: {
		type: Date
	}, 
	cart: {
		items: [
			{
				count: {
					type: Number,
					required: true,
					default: 1
				},
				courseId: {
					type: Schema.Types.ObjectId,
					ref: 'Course',
					required: true,

				}
			}
		]
	}
})

//Добавляем свой метод
user.methods.addToCart = function(course) {

	const clonedItems = [...this.cart.items]
	const idx = clonedItems.findIndex(c => {
		return c.courseId.toString() === course._id.toString()
	})

	// В корзине уже есть такой курс
	if(idx >= 0) {
		clonedItems[idx].count = this.cart.items[idx].count + 1
	} else {
		clonedItems.push({
			courseId: course._id,
			count: 1
		})
	}

	this.cart = {
		items: clonedItems
	}

	return this.save()
}

user.methods.removeFromCart = function(id) {

	let clonedItems = [...this.cart.items]
	const idx = clonedItems.findIndex(c => c.courseId.toString() === id.toString())

	if(clonedItems[idx].count === 1) {
		clonedItems = clonedItems.filter(c => c.courseId.toString() !== id.toString())
	} else {
		clonedItems[idx].count--
	}

	this.cart = {
		items: clonedItems
	}

	return this.save()
}

user.methods.clearCart = function() {
	
	this.cart = {items: []}

	return this.save()
}

module.exports = model('User', user)