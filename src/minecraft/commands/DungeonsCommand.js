const MinecraftCommand = require('../../contracts/MinecraftCommand')

class DungeonsCommand extends MinecraftCommand {
	constructor(minecraft) {
		super(minecraft)

		this.name = 'dungeons'
		this.aliases = ['dungeon', 'd', 'dung', 'dun']
		this.description = 'returns the user dungeon information on their latest or specified profile'
	}

	onCommand(username, message) {
		//implement dungeons
	}
}

module.exports = DungeonsCommand
