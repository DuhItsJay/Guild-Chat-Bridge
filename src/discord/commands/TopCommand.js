const DiscordCommand = require('../../contracts/DiscordCommand')

class TopCommand extends DiscordCommand {
	constructor(discord) {
		super(discord)

		this.name = 'top'
		this.aliases = []
		this.description = 'Shows a list of players with the highest gexp recieved today'
	}

	onCommand(message) {
		this.sendMinecraftMessage(`/g top`)
	}
}

module.exports = TopCommand
