const MinecraftCommand = require('../../contracts/MinecraftCommand')
const SkillsGenerator = require('./calculators/SkillsGenerator')

class SkillsCommand extends MinecraftCommand {
	constructor(minecraft) {
		super(minecraft)

		this.name = 'skills'
		this.aliases = ['skill', 's']
		this.description = 'returns the user skill information on their latest or specified profile'
	}

	async onCommand(username, message) {
		let args = this.getArgs(message)
		let ign = username
		if (!this.minecraft.profiles.includes(args[0]) && args[0]) {
			ign = args.shift()
		}
		let profile = args.shift()
		let uuid = await this.getUUID(ign)
		let curr_profile

		if (uuid == 'terminate') return this.minecraft.bot.chat(`/w ${username} ${ign} is an invalid ign`)
		this.fetchRequest(uuid).then(async data => {
			if (profile == undefined) {
				const activeProfile = this.sortByLatest(data.profiles, uuid)
				curr_profile = activeProfile.members[uuid]
			} else {
				curr_profile =
					data.profiles.findIndex(a => a.cute_name == profile) == -1
						? this.sortByLatest(data.profiles, uuid).members[uuid]
						: data.profiles[data.profiles.findIndex(a => a.cute_name == profile)].members[uuid]
			}

			return this.minecraft.bot.chat(`/w ${username} ${ign}'s skill average: ${this.onParseData(curr_profile)}`)
		})
	}

	onParseData(curr_profile) {
		const skills_data = SkillsGenerator.execute(curr_profile)

		return skills_data.skill_average.toFixed(2)
	}
}

module.exports = SkillsCommand
