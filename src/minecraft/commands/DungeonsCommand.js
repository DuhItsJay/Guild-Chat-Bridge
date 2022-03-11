const MinecraftCommand = require('../../contracts/MinecraftCommand')

class DungeonsCommand extends MinecraftCommand {
	constructor(minecraft) {
		super(minecraft)

		this.name = 'dungeons'
		this.aliases = ['dungeon', 'd', 'dung', 'dun']
		this.description = 'returns the user dungeon information on their latest or specified profile'
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

			return this.minecraft.bot.chat(`/gc ${username}'s dungeon weight: ${this.onParseData(curr_profile)}`)
		})
	}

	onParseData(curr_profile) {
		const dungeon_data = DungeonsGenerator.execute(curr_profile)

		return (Number(dungeon_data['weight'] || 0) + Number(dungeon_data['weight_overflow'] || 0)).toFixed(2)
	}
}

module.exports = DungeonsCommand
