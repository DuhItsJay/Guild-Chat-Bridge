const DiscordCommand = require('../../contracts/DiscordCommand')

class MemberCommand extends DiscordCommand {
	constructor(discord) {
		super(discord)

		this.name = 'member'
		this.aliases = ['mem']
		this.description = 'Gets gexp data from the user'
	}

	onCommand(message) {
		let args = this.getArgs(message)
		let user = args.shift()

		this.sendMinecraftMessage(`/g member ${user ? user : ''}`)
	}
}

module.exports = MemberCommand
