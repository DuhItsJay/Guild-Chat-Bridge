const DiscordCommand = require('../../contracts/DiscordCommand')

class QuestCommand extends DiscordCommand {
	constructor(discord) {
		super(discord)

		this.name = 'quest'
		this.aliases = ['q']
		this.description = `Shows information regarding the current Guild Quest`
	}

	onCommand(message) {
		this.sendMinecraftMessage('/g quest')
	}
}

module.exports = QuestCommand
