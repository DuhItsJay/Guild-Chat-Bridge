const MinecraftCommand = require('../../contracts/MinecraftCommand')
const SlayersGenerator = require('./calculators/SlayersGenerator')

class SlayersCommand extends MinecraftCommand {
	constructor(minecraft) {
		super(minecraft)

		this.name = 'slayers'
		this.aliases = ['slayer', 'slay']
		this.description = 'returns the user slayer information on their latest or specified profile'
	}

	onCommand(username, message) {
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

			return this.minecraft.bot.chat(`/gc ${username}'s slayer weight: ${this.onParseData(curr_profile)}`)
		})
	}

	onParseData(curr_profile) {
		const slayer_data = SlayersGenerator.execute(curr_profile)

		return (Number(slayer_data['weight']) + Number(slayer_data['weight_overflow'])).toFixed(2)
	}
}

module.exports = SlayersCommand
