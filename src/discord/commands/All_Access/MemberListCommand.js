const DiscordCommand = require('../../../contracts/DiscordCommand')

class MemberListCommand extends DiscordCommand {
	constructor(discord) {
		super(discord)

		this.name = 'list'
		this.aliases = ['mems', 'members']
		this.description = 'Shows a list of all the members in the guild'
	}

	onCommand(message) {
		this.sendMinecraftMessage(`/g list`)
	}
}

module.exports = MemberListCommand
