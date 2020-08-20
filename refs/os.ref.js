const os = require('os')

// Платформа
console.log(os.platform())

// Архитектура
console.log(os.arch())

// Инфа о ядрах
console.log(os.cpus());


// Всего памяти
console.log(os.totalmem());

// Свободная память
console.log(os.freemem());


// Корневая директория
console.log(os.homedir());


// Сколько система работает
console.log(os.uptime() / 1000);