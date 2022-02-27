const chalk = require('chalk')

class Logger {
	//discord side events in console. Bot connection status, Bot Commands
	discord(message) {
		return console.log(chalk.bgMagenta.black(`[${this.getCurrentTime()}] Discord >`) + ' ' + chalk.magenta(message))
	}

	//minecraft side events in console. Minecraft Commands, Limbo & client status
	minecraft(message) {
		return console.log(chalk.bgGreenBright.black(`[${this.getCurrentTime()}] Minecraft >`) + ' ' + chalk.greenBright(message))
	}

	//Bridge bot disconnects, "typing too fast" hypixel error
	warn(message) {
		return console.log(chalk.bgYellow.black(`[${this.getCurrentTime()}] Warning >`) + ' ' + chalk.yellow(message))
	}

	//Bridge bot connection error, invalid discord bot tokens
	error(message) {
		return console.log(chalk.bgRedBright.black(`[${this.getCurrentTime()}] Error >`) + ' ' + chalk.redBright(message))
	}

	//Discord user messages, Minecraft guild & pm messages
	broadcast(message, location) {
		return console.log(chalk.inverse(`[${this.getCurrentTime()}] ${location} Broadcast >`) + ' ' + message)
	}

	//Format current time into human readable format
	getCurrentTime() {
		return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
	}
}

module.exports = Logger
