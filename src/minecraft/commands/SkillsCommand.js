const MinecraftCommand = require('../../contracts/MinecraftCommand')

class SkillsCommand extends MinecraftCommand {
	constructor(minecraft) {
		super(minecraft)

		this.name = 'skills'
		this.aliases = ['skill', 's']
		this.description = 'returns the user skill information on their latest or specified profile'
	}

	onCommand(username, message) {
		//implement skills
	}
}

module.exports = SkillsCommand
