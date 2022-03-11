const MinecraftCommand = require('../../contracts/MinecraftCommand')

class SlayersCommand extends MinecraftCommand {
	constructor(minecraft) {
		super(minecraft)

		this.name = 'slayers'
		this.aliases = ['slayer', 'slay']
		this.description = 'returns the user slayer information on their latest or specified profile'
	}

	onCommand(username, message) {
		//implement slayers
	}
}

module.exports = SlayersCommand
