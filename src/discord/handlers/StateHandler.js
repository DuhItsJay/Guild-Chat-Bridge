class StateHandler {
	constructor(discord) {
		this.discord = discord
	}

	async onReady() {
		this.discord.app.log.discord('Client ready, logged in as ' + this.discord.client.user.tag)
		this.discord.client.user.setActivity('a!help', { key: 'PLAYING' })

		if (this.discord.app.config.discord.messageMode == 'webhook') {
			this.discord.webhook = await getWebhook(this.discord)
		}

		Object.values(this.discord.app.config.discord.channel).forEach(key => {
			if (key != null) {
				this.discord.client.channels.fetch(key).then(channel => {
					channel.send({
						embed: {
							author: { name: `Chat Bridge is Online` },
							color: '47F049',
						},
					})
				})
			}
		})
	}

	onClose() {
		Object.values(this.discord.app.config.discord.channel).forEach(key => {
			if (key != null) {
				this.discord.client.channels
					.fetch(key)
					.then(channel => {
						channel
							.send({
								embed: {
									author: { name: `Chat Bridge is Offline` },
									color: 'F04947',
								},
							})
							.then(() => {
								process.exit()
							})
					})
					.catch(() => {
						process.exit()
					})
			}
		})
	}
}

async function getWebhook(discord) {
	Object.values(this.discord.app.config.discord.channel).forEach(async key => {
		if (key != null) {
			let channel = discord.client.channels.cache.get(key)
			let webhooks = await channel.fetchWebhooks()
			if (webhooks.first()) {
				return webhooks.first()
			} else {
				var res = await channel.createWebhook(discord.client.user.username, {
					avatar: discord.client.user.avatarURL(),
				})
				return res
			}
		}
	})
}

module.exports = StateHandler
