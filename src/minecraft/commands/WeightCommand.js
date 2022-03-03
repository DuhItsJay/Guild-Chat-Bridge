const MinecraftCommand = require('../../contracts/MinecraftCommand')

class WeightCommand extends MinecraftCommand {
	constructor(minecraft) {
		super(minecraft)

		this.name = 'weight'
		this.aliases = ['w']
		this.description = 'returns the users weight on their latest or specified profile'
	}

	onCommand(username, message) {
		//contruct weight command and add skill, dungeon, slayer stats while you are at it
	}
}

module.exports = WeightCommand
