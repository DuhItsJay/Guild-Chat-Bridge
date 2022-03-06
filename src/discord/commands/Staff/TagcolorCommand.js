const DiscordCommand = require('../../../contracts/DiscordCommand')

class TagColor extends DiscordCommand {
	constructor(discord) {
		super(discord)

		this.name = 'tagcolor'
		this.aliases = ['tc']
		this.description = 'Changes guild tag color'
	}

	onCommand(message) {
		let args = this.getArgs(message)
		let tag = args.shift()

		this.sendMinecraftMessage(`/g tagcolor ${tag}`)
	}
}

module.exports = TagColor
