const DiscordCommand = require('../../contracts/DiscordCommand')

class OnlineCommand extends DiscordCommand {
	constructor(discord) {
		super(discord)

		this.name = 'online'
		this.aliases = ['on']
		this.description = 'Shows a list of current online members'
	}

	onCommand(message) {
		this.sendMinecraftMessage(`/g online`)
	}
}

module.exports = OnlineCommand
