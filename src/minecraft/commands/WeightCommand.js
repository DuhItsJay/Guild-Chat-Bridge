const MinecraftCommand = require('../../contracts/MinecraftCommand')
const DungeonsGenerator = require('./calculators/DungeonsGenerator')
const SkillsGenerator = require('./calculators/SkillsGenerator')
const SlayersGenerator = require('./calculators/SlayersGenerator')

class WeightCommand extends MinecraftCommand {
	constructor(minecraft) {
		super(minecraft)

		this.name = 'weight'
		this.aliases = ['w']
		this.description = 'returns the user weight information on their latest or specified profile'
	}

	async onCommand(username, message) {
		let args = this.getArgs(message)
		let profile = args.shift()
		let uuid = await this.getUUID(username)
		let curr_profile

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

			return this.minecraft.bot.chat(`/gc ${username}'s weight: ${this.onParseData(curr_profile)}`)
		})
	}

	onParseData(curr_profile) {
		const dungeon_data = DungeonsGenerator.execute(curr_profile)
		const skills_data = SkillsGenerator.execute(curr_profile)
		const slayer_data = SlayersGenerator.execute(curr_profile)

		var skill = (Number(skills_data['weight']) + Number(skills_data['weight_overflow'])).toFixed(2)
		var slayer = (Number(slayer_data['weight']) + Number(slayer_data['weight_overflow'])).toFixed(2)
		var dungeon = (Number(dungeon_data['weight']) + Number(dungeon_data['weight_overflow'])).toFixed(2)

		return (total_weight = parseInt(skill) + parseInt(slayer) + parseInt(dungeon))
	}
}

module.exports = WeightCommand
