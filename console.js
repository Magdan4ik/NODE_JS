function consoleToJson() {
	const log = {}

	for (let i = 2; i < process.argv.length; i++) {
		const arg = process.argv[i].split('=')
		log[arg[0]] = arg[1] || true
	}

	return log
}

console.log(consoleToJson())

// cmd
// node console.js msg=hello spec