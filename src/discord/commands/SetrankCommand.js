const DiscordCommand = require('../../contracts/DiscordCommand')

class SetrankCommand extends DiscordCommand {
	constructor(discord) {
		super(discord)

		this.name = 'setrank'
		this.aliases = ['sr', 'rank']
		this.description = `Sets a player's rank`
	}

	onCommand(message) {
		let args = this.getArgs(message)
		let user = args.shift()
		let rank = args.shift()

		this.sendMinecraftMessage(`/g setrank ${user ? user : ''} ${rank ? rank : ''}`)
	}
}

module.exports = SetrankCommand
