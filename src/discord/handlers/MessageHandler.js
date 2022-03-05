class MessageHandler {
	constructor(discord, command) {
		this.discord = discord
		this.command = command
	}

	async onMessage(message, client) {
		if (!this.shouldBroadcastMessage(message, client)) {
			return
		}

		if (this.command.handle(message)) {
			return
		}

		const content = this.stripDiscordContent(message.content).trim()
		if (content.length == 0) {
			return
		}

		this.discord.broadcastMessage({
			username: message.member.displayName,
			message: this.stripDiscordContent(message.content),
			replyingTo: await this.fetchReply(message),
		})
	}

	async fetchReply(message) {
		try {
			if (!message.reference) return null

			const reference = await message.channel.messages.fetch(message.reference.messageID)

			return reference.member ? reference.member.displayName : reference.author.username
		} catch (e) {
			return null
		}
	}

	stripDiscordContent(message) {
		return message
			.replace(/<[@|#|!|&]{1,2}(\d+){16,}>/g, '\n')
			.replace(/<:\w+:(\d+){16,}>/g, '\n')
			.replace(/[^\p{L}\p{N}\p{P}\p{Z}\p{Z}\p{Po}\p{Sm}]/gu, '\n')
			.split('\n')
			.map(part => {
				part = part.trim()

				return part.length == 0 ? '' : part + ' '
			})
			.join('')
	}

	shouldBroadcastMessage(message, client) {
		return message.author.id != client.user.id && message.channel.id == this.discord.app.config.discord.channel && message.content && message.content.length > 0
	}
}

module.exports = MessageHandler
