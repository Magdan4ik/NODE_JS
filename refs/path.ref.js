const path = require('path')

console.log(1, path.basename(__filename)) // название файла
console.log(2, path.dirname(__filename))  // имя папки
console.log(3, path.extname(__filename)) // расш. файла
console.log(4, path.parse(__filename)) // парсит в обьект
console.log(5, path.join(__dirname, 'test1', 'test2')) // конкатенирует пути
console.log(6, path.resolve(__dirname, './test3', 'test4')) // нормализирует пути