const MinecraftCommand = require('../../contracts/MinecraftCommand')
const SlayersGenerator = require('./calculators/SlayersGenerator')
const { abbreviateNumber } = require('../utils/datacrunch')

class SlayersCommand extends MinecraftCommand {
	constructor(minecraft) {
		super(minecraft)

		this.name = 'slayers'
		this.aliases = ['slayer', 'slay']
		this.description = 'returns the user slayer information on their latest or specified profile'
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

			return this.minecraft.bot.chat(`/w ${username} ${ign}'s total slayer experience: ${this.onParseData(curr_profile)}`)
		})
	}

	onParseData(curr_profile) {
		const slayer_data = SlayersGenerator.execute(curr_profile)

		return abbreviateNumber(Number(slayer_data.total_experience).toFixed(2))
	}
}

module.exports = SlayersCommand
