const DiscordCommand = require('../../contracts/DiscordCommand')

class OnlinemodeCommand extends DiscordCommand {
	constructor(discord) {
		super(discord)

		this.name = 'onlinemode'
		this.aliases = ['onmode']
		this.description = 'Toggle if offline players are displayed in the guild list'
	}

	onCommand(message) {
		this.sendMinecraftMessage(`/g onlinemode`)
	}
}

module.exports = OnlinemodeCommand
