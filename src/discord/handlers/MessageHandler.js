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

		this.discord.currChannel.push(Object.entries(this.discord.app.config.discord.channel).find(item => item[1] == message.channel.id)[0])

		this.discord.broadcastMessage({
			username: message.member.displayName,
			message: this.stripDiscordContent(message.content),
			replyingTo: await this.fetchReply(message),
			chatType: this.returnChatType(message.channel.id),
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
			.replace(/[^\p{L}\p{N}\p{P}\p{Z}\p{S}]/gu, '\n')
			.split('\n')
			.map(part => {
				part = part.trim()

				return part.length == 0 ? '' : part + ' '
			})
			.join('')
	}

	returnChatType(channel_id) {
		return Object.entries(this.discord.app.config.discord.channel).find(entry => entry[1] == channel_id)[0]
	}

	shouldBroadcastMessage(message, client) {
		return (
			message.author.id != client.user.id &&
			Object.values(this.discord.app.config.discord.channel).includes(message.channel.id) &&
			message.content &&
			message.content.length > 0
		)
	}
}

module.exports = MessageHandler
