const DiscordCommand = require('../../../contracts/DiscordCommand')

class ChangediscordCommand extends DiscordCommand {
	constructor(discord) {
		super(discord)

		this.name = 'discord'
		this.aliases = []
		this.description = `Set or view the guild's discord link`
	}

	onCommand(message) {
		let args = this.getArgs(message)
		let discord = args.shift()

		this.sendMinecraftMessage(discord ? `/g discord ${discord}` : '/g discord')
	}
}

module.exports = ChangediscordCommand
