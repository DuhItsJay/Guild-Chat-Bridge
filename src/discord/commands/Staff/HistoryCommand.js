const DiscordCommand = require('../../../contracts/DiscordCommand')

class HistoryCommand extends DiscordCommand {
	constructor(discord) {
		super(discord)

		this.name = 'history'
		this.aliases = ['hist']
		this.description = `View the last 24 hours of guild events`
	}

	onCommand(message) {
		this.sendMinecraftMessage('/g history')
	}
}

module.exports = HistoryCommand
