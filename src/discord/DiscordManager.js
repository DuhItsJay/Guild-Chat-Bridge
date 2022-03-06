const CommunicationBridge = require('../contracts/CommunicationBridge')
const StateHandler = require('./handlers/StateHandler')
const MessageHandler = require('./handlers/MessageHandler')
const CommandHandler = require('./CommandHandler')
const Discord = require('discord.js-light')

class DiscordManager extends CommunicationBridge {
	constructor(app) {
		super()

		this.app = app

		this.stateHandler = new StateHandler(this)
		this.messageHandler = new MessageHandler(this, new CommandHandler(this))

		this.color = null
		this.currChannel = new Array()
	}

	connect() {
		this.client = new Discord.Client({
			cacheGuilds: true,
			cacheChannels: true,
			cacheOverwrites: false,
			cacheRoles: true,
			cacheEmojis: false,
			cachePresences: false,
		})

		this.client.on('ready', () => {
			this.stateHandler.onReady()
			this.client.channels.fetch(this.app.config.discord.channel.guild).then(channel => {
				this.color = channel.guild.members.cache.get(this.client.user.id).roles.highest.color
			})
		})

		this.client.on('message', message => this.messageHandler.onMessage(message, this.client))

		this.client.login(this.app.config.discord.token).catch(error => {
			this.app.log.error(error)

			process.exit(1)
		})

		process.on('SIGINT', () => this.stateHandler.onClose())
	}

	onBroadcast({ username, message, guildRank, chatType }) {
		const protocolRegex =
			/\b(?<protocol>https?|ftp):\/\/(?<domain>[-A-Z0-9.]+)(?<file>\/[-A-Z0-9+&@#\/%=~_|!:,.;]*)?(?<parameters>\?[A-Z0-9+&@#\/%=~_|!:,.;]*)?/gi
		const domainRegex = /(?<=\s)\b(?<domain>[-A-Z0-9.]+)\/(?<file>[-A-Z0-9+&@#\/%=~_|!:,.;]*)?(?<parameters>\?[A-Z0-9+&@#\/%=~_|!:,.;]*)?/gi

		const protocol_url = message.match(protocolRegex)
		const domain_url = message.match(domainRegex)
		message = message.replace(protocolRegex, ` [[link shared](${protocol_url})]`).replace(domainRegex, ` [[link shared](https://${domain_url})]`)

		this.app.log.broadcast(`${username} [${guildRank}]: ${message}`, `Discord`)
		switch (this.app.config.discord.messageMode.toLowerCase()) {
			case 'bot':
				this.app.discord.client.channels.fetch(this.app.config.discord.channel[chatType]).then(channel => {
					channel.send({
						embed: {
							color: this.color,
							author: {
								name: `${username} [${guildRank}]`,
								icon_url: 'https://www.mc-heads.net/avatar/' + username,
							},
							description: message,
						},
						/*
						embed: {
							color: this.color,
							author: {
								name: `${username} [${guildRank}]: ${message}`,
								icon_url: 'https://www.mc-heads.net/avatar/' + username,
							},
						},*/
					})
				})
				break

			/*case 'webhook':
				message = message.replace(/@/g, '') // Stop pinging @everyone or @here
				this.app.discord.webhook.send(message, { username: username, avatarURL: 'https://www.mc-heads.net/avatar/' + username })
				break*/

			default:
				throw new Error('Invalid message mode: must be bot or webhook')
		}
	}

	onBroadcastCleanEmbed({ message, color }) {
		this.app.log.broadcast(message, 'Event')

		this.app.discord.client.channels.fetch(this.app.config.discord.channel[this.currChannel.shift()]).then(channel => {
			channel.send({
				embed: {
					color: color,
					description: message,
				},
			})
		})
	}

	onBroadcastTitleEmbed({ message, title, color }) {
		this.app.log.broadcast(message, 'Event')

		this.app.discord.client.channels.fetch(this.app.config.discord.channel[this.currChannel.shift()]).then(channel => {
			channel.send({
				embed: {
					color: color,
					description: message,
					title: title,
				},
			})
		})
	}

	onBroadcastHeadedEmbed({ message, title, icon, color }) {
		this.app.log.broadcast(message, 'Event')

		this.app.discord.client.channels.fetch(this.app.config.discord.channel[this.currChannel.shift()]).then(channel => {
			channel.send({
				embed: {
					color: color,
					author: {
						name: title,
						icon_url: icon,
					},
					description: message,
				},
			})
		})
	}

	onPlayerToggle({ username, message, color }) {
		this.app.log.broadcast(username + ' ' + message, 'Event')

		switch (this.app.config.discord.messageMode.toLowerCase()) {
			case 'bot':
				this.app.discord.client.channels.fetch(this.app.config.discord.channel[this.currChannel.shift()]).then(channel => {
					channel.send({
						embed: {
							color: color,
							author: {
								name: `${username} ${message}`,
								icon_url: 'https://www.mc-heads.net/avatar/' + username,
							},
						},
					})
				})
				break

			/*case 'webhook':
				this.app.discord.webhook.send({
					username: username,
					avatarURL: 'https://www.mc-heads.net/avatar/' + username,
					embeds: [
						{
							color: color,
							description: `${username} ${message}`,
						},
					],
				})
				break*/

			default:
				throw new Error('Invalid message mode: must be bot or webhook')
		}
	}
}

module.exports = DiscordManager
