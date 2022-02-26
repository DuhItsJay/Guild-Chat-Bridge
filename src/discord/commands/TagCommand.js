const DiscordCommand = require('../../contracts/DiscordCommand')

class TagCommand extends DiscordCommand {
	constructor(discord) {
		super(discord)

		this.name = 'tag'
		this.aliases = []
		this.description = 'Changes guild tag'
	}

	onCommand(message) {
		let args = this.getArgs(message)
		let tag = args.shift()

		this.sendMinecraftMessage(`/g tag ${tag ? tag : ''}`)
	}
}

module.exports = TagCommand
