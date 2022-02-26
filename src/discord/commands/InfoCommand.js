const DiscordCommand = require('../../contracts/DiscordCommand')

class InfoCommand extends DiscordCommand {
	constructor(discord) {
		super(discord)

		this.name = 'info'
		this.aliases = ['inf']
		this.description = 'Shows the guilds info'
	}

	onCommand(message) {
		this.sendMinecraftMessage(`/g info`)
	}
}

module.exports = InfoCommand
