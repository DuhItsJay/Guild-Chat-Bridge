const DiscordCommand = require('../../contracts/DiscordCommand')

class LogCommand extends DiscordCommand {
	constructor(discord) {
		super(discord)

		this.name = 'log'
		this.aliases = []
		this.description = 'View the audit log'
	}

	onCommand(message) {
		let args = this.getArgs(message)
		let page = args.shift()

		this.sendMinecraftMessage(page ? `/g log ${[page]}` : '/g log')
	}
}

module.exports = LogCommand
