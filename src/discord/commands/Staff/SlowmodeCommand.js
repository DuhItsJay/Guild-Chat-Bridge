const DiscordCommand = require('../../../contracts/DiscordCommand')

class SlowCommand extends DiscordCommand {
	constructor(discord) {
		super(discord)

		this.name = 'slowmode'
		this.aliases = ['slow', 'sm']
		this.description = `Toggle slow chat, requiring guild members to wait 10 seconds between messages`
	}

	onCommand(message) {
		this.sendMinecraftMessage('/g slow')
	}
}

module.exports = SlowCommand
