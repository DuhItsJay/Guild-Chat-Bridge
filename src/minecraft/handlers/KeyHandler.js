const EventHandler = require('../../contracts/EventHandler')
const axios = require('axios')

class KeyHandler extends EventHandler {
	constructor(minecraft, bot) {
		super()

		this.minecraft = minecraft
	}

	async registerEvents() {
		setTimeout(() => {
			this.onStatus()
		}, 10000)
	}

	fetchAPIKey(error) {
		if (this.minecraft.app.config.api.autoReplace && error.response.status == 403) {
			this.minecraft.app.log.broadcast(`Replacing API Key`, 'Minecraft')
			return this.minecraft.bot.chat(`/api new`)
		}
		if (error.response.status == 429) {
			return this.minecraft.app.log.error(error.response.data.global ? 'Global Throttle has been placed' : 'Key limit reached')
		}

		this.minecraft.app.log.error('API Key cannot be replaced => autoReplace is set to false')
		throw new Error('Invalid API Setting: A valid key needs to be configured or autoReplace has to be turned on')
	}

	async onStatus() {
		await axios.get(`https://api.hypixel.net/key?key=${this.minecraft.app.config.api.key}`).catch(error => {
			this.fetchAPIKey(error)
		})
	}
}

module.exports = KeyHandler
