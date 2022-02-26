const DiscordCommand = require('../../contracts/DiscordCommand')

class UnmuteCommand extends DiscordCommand {
	constructor(discord) {
		super(discord)

		this.name = 'unmute'
		this.aliases = [`un`, `um`]
		this.description = 'unmutes the guild or <player> player'
	}

	onCommand(message) {
		let args = this.getArgs(message)
		let user = args.shift()

		this.sendMinecraftMessage(!user ? `/g unmute ${user}` : '/g unmute')
	}
}

module.exports = UnmuteCommand
