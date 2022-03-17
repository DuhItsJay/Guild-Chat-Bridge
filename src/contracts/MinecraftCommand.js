const axios = require('axios')
const URL = require('url').URL

const HYPIXEL_API = 'https://api.hypixel.net'
const PROFILE_ROUTE = HYPIXEL_API + '/skyblock/profiles'

class MinecraftCommand {
	constructor(minecraft) {
		this.minecraft = minecraft
	}

	getArgs(message) {
		let args = message.split(' ')

		args.shift()

		return args
	}

	send(message) {
		if (this.minecraft.bot.player !== undefined) {
			this.minecraft.bot.chat(message)
		}
	}

	onCommand(player, message) {
		throw new Error('Command onCommand method is not implemented yet!')
	}

	sortByLatest(data, uuid) {
		return data.sort((a, b) => b.members[uuid].last_save - a.members[uuid].last_save)[0]
	}

	async getUUID(username) {
		const { data } = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`)

		return data.hasOwnProperty('id') ? data.id : 'terminate'
	}

	async fetchRequest(uuid) {
		const url = new URL(PROFILE_ROUTE)
		url.searchParams.append('key', this.minecraft.app.config.api.key)
		url.searchParams.append('uuid', uuid)

		let { data } = await axios(url.toString())

		return data
	}
}

module.exports = MinecraftCommand
