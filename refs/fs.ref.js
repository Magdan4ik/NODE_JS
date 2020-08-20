const fs = require('fs')
const path = require('path')



// ***************************
// методы fs работают асинхронно
// чтобы выполнялись по порядку, нужно выполнять в коллбеке
// ****************************

// Создать папку

// fs.mkdir(path.join(__dirname, 'notes'), (err) => {
// 	if(err) throw err
// 	console.log('Папка создана')
// })

// Создать файл
fs.writeFile(
	path.join(__dirname, 'notes', 'note.txt'), 
	'Hello Note', 
	(err) => {
		if(err) throw err
		console.log('Файл note.txt создан')

		// Добавить даные к файлу
		fs.appendFile(
			path.join(__dirname, 'notes', 'note.txt'), 
			' From append file',
			(err) => {
				if(err) throw err
				console.log('Файл был изменен')

				// Прочитать файл
				fs.readFile(
					path.join(__dirname, 'notes', 'note.txt'),
					'utf-8',
					(err, data) => {
						if(err) throw err
						console.log('Содержание файла:', data)
						
						// Переименовать файл
						fs.rename(
							path.join(__dirname, 'notes', 'note.txt'), 
							path.join(__dirname, 'notes', 'noteNew.txt'), 
							(err) => {
								if(err) throw err
								console.log('Файл переименован')
							}
						)
					}
				)
			}
		)
	}
)