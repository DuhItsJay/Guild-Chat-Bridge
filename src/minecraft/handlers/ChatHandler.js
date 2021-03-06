const EventHandler = require('../../contracts/EventHandler')

class StateHandler extends EventHandler {
	constructor(minecraft, command) {
		super()

		this.minecraft = minecraft
		this.command = command
		this.collect = false
		this.msg_col = []
	}

	registerEvents(bot) {
		this.bot = bot

		this.bot.on('message', (...args) => this.onMessage(...args))
	}

	onMessage(event) {
		const message = event.toString().trim()

		if (this.isLobbyJoinMessage(message)) {
			this.minecraft.app.log.minecraft('Sending Minecraft client to limbo')
			return this.bot.chat('/ac §')
		}

		if (this.isAPIMessage(message) && this.minecraft.app.config.api.autoReplace) {
			this.minecraft.app.discord.currChannel.shift()
			this.minecraft.app.log.minecraft('New API key recieved')
			return (this.minecraft.app.config.api.key = message.match(/(?<Key>[A-Z0-9-]{36})/i)[0])
		}

		if (this.isFailedChatMessage(message)) {
			return
		}

		if (this.isLoginMessage(message)) {
			let user = message.split('>')[1].trim().split('joined.')[0].trim()

			return this.minecraft.broadcastPlayerToggle({ username: user, message: `joined.`, color: '47F049' })
		}

		if (this.isLogoutMessage(message)) {
			let user = message.split('>')[1].trim().split('left.')[0].trim()

			return this.minecraft.broadcastPlayerToggle({ username: user, message: `left.`, color: 'F04947' })
		}

		if (this.isJoinMessage(message)) {
			let user = message
				.replace(/\[(.*?)\]/g, '')
				.trim()
				.split(/ +/g)[0]

			return this.minecraft.broadcastHeadedEmbed({
				message: `${user} joined the guild!`,
				title: `Member Joined`,
				icon: `https://mc-heads.net/avatar/${user}`,
				color: '47F049',
			})
		}

		if (this.isLeaveMessage(message)) {
			let user = message
				.replace(/\[(.*?)\]/g, '')
				.trim()
				.split(/ +/g)[0]

			return this.minecraft.broadcastHeadedEmbed({
				message: `${user} left the guild!`,
				title: `Member Left`,
				icon: `https://mc-heads.net/avatar/${user}`,
				color: 'F04947',
			})
		}

		if (this.isKickMessage(message)) {
			let user = message
				.replace(/\[(.*?)\]/g, '')
				.trim()
				.split(/ +/g)[0]

			return this.minecraft.broadcastHeadedEmbed({
				message: `${user} was kicked from the guild!`,
				title: `Member Kicked`,
				icon: `https://mc-heads.net/avatar/${user}`,
				color: 'F04947',
			})
		}

		if (this.isPromotionMessage(message)) {
			let username = message
				.replace(/\[(.*?)\]/g, '')
				.trim()
				.split(/ +/g)[0]
			let newRank = message
				.replace(/\[(.*?)\]/g, '')
				.trim()
				.split(' to ')
				.pop()
				.trim()

			return this.minecraft.broadcastCleanEmbed({ message: `${username} was promoted to ${newRank}`, color: '47F049' })
		}

		if (this.isDemotionMessage(message)) {
			let username = message
				.replace(/\[(.*?)\]/g, '')
				.trim()
				.split(/ +/g)[0]
			let newRank = message
				.replace(/\[(.*?)\]/g, '')
				.trim()
				.split(' to ')
				.pop()
				.trim()

			return this.minecraft.broadcastCleanEmbed({ message: `${username} was demoted to ${newRank}`, color: 'F04947' })
		}

		if (this.isHighestRank(message)) {
			let user = message
				.replace(/\[(.*?)\]/g, '')
				.trim()
				.split(' ')[0]

			return this.minecraft.broadcastCleanEmbed({ message: `${user} is already the highest guild rank!`, color: 'DC143C' })
		}

		if (this.isLowestRank(message)) {
			let user = message
				.replace(/\[(.*?)\]/g, '')
				.trim()
				.split(' ')[0]

			return this.minecraft.broadcastCleanEmbed({ message: `${user} is already the lowest guild rank!`, color: 'DC143C' })
		}

		if (this.isSetrankFail(message)) {
			return this.minecraft.broadcastCleanEmbed({ message: `Rank not found.`, color: 'DC143C' })
		}

		if (this.isAlreadyHasRank(message)) {
			return this.minecraft.broadcastCleanEmbed({ message: `They already have that rank!`, color: 'DC143C' })
		}

		if (this.isNotInGuild(message)) {
			let user = message
				.replace(/\[(.*?)\]/g, '')
				.trim()
				.split(' ')[0]

			return this.minecraft.broadcastCleanEmbed({ message: `${user} is not in the guild.`, color: 'DC143C' })
		}

		if (this.isBlockedMessage(message)) {
			let blockedMsg = message.match(/".+"/g)[0].slice(1, -1)

			return this.minecraft.broadcastCleanEmbed({ message: `Message \`${blockedMsg}\` blocked by Hypixel.`, color: 'DC143C' })
		}

		if (this.isRepeatMessage(message)) {
			return this.minecraft.broadcastCleanEmbed({ message: `You cannot say the same message twice!`, color: 'DC143C' })
		}

		if (this.isNoPermission(message)) {
			return this.minecraft.broadcastCleanEmbed({ message: `I don't have permission to do that!`, color: 'DC143C' })
		}

		if (this.isIncorrectUsage(message)) {
			return this.minecraft.broadcastCleanEmbed({ message: message.split("'").join('`'), color: 'DC143C' })
		}

		if (this.isOnlineInvite(message)) {
			let user = message
				.replace(/\[(.*?)\]/g, '')
				.trim()
				.split(/ +/g)[2]

			return this.minecraft.broadcastCleanEmbed({ message: `${user} was invited to the guild!`, color: '47F049' })
		}

		if (this.isOfflineInvite(message)) {
			let user = message
				.replace(/\[(.*?)\]/g, '')
				.trim()
				.split(/ +/g)[6]
				.match(/\w+/g)[0]

			return this.minecraft.broadcastCleanEmbed({ message: `${user} was offline invited to the guild!`, color: '47F049' })
		}

		if (this.isFailedInvite(message)) {
			return this.minecraft.broadcastCleanEmbed({ message: message.replace(/\[(.*?)\]/g, '').trim(), color: 'DC143C' })
		}

		if (this.isGuildMuteMessage(message)) {
			let time = message
				.replace(/\[(.*?)\]/g, '')
				.trim()
				.split(/ +/g)[7]

			return this.minecraft.broadcastCleanEmbed({ message: `Guild Chat has been muted for ${time}`, color: 'F04947' })
		}

		if (this.isGuildUnmuteMessage(message)) {
			return this.minecraft.broadcastCleanEmbed({ message: `Guild Chat has been unmuted!`, color: '47F049' })
		}

		if (this.isGuildNotMuted(message)) {
			return this.minecraft.broadcastCleanEmbed({ message: `The guild is not muted!`, color: 'F04947' })
		}

		if (this.isUserMuteMessage(message)) {
			let user = message
				.replace(/\[(.*?)\]/g, '')
				.trim()
				.split(/ +/g)[3]
				.replace(/[^\w]+/g, '')
			let time = message
				.replace(/\[(.*?)\]/g, '')
				.trim()
				.split(/ +/g)[5]

			return this.minecraft.broadcastCleanEmbed({ message: `${user} has been muted for ${time}`, color: 'F04947' })
		}

		if (this.isUserUnmuteMessage(message)) {
			let user = message
				.replace(/\[(.*?)\]/g, '')
				.trim()
				.split(/ +/g)[3]

			return this.minecraft.broadcastCleanEmbed({ message: `${user} has been unmuted!`, color: '47F049' })
		}

		if (this.isAlreadyMuted(message)) {
			return this.minecraft.broadcastCleanEmbed({ message: `This user is already muted!`, color: 'DC143C' })
		}

		if (this.isSlowMessage(message)) {
			let color = message.includes('disabled') ? '47F049' : 'F04947'

			return this.minecraft.broadcastCleanEmbed({ message: message.replace('Guild >', ''), color: color })
		}

		if (this.isGuildNotifications(message)) {
			let color = message.includes('Enabled') ? '47F049' : 'F04947'

			return this.minecraft.broadcastCleanEmbed({ message: message, color: color })
		}

		if (this.isOnlineModeMessage(message)) {
			let color = message.includes('Enabled') ? '47F049' : 'F04947'

			return this.minecraft.broadcastCleanEmbed({ message: message, color: color })
		}

		if (this.isTooFast(message)) {
			return this.minecraft.app.log.warn(message)
		}

		if (this.isPlayerNotFound(message)) {
			let user = message.split(' ')[8].slice(1, -1)

			return this.minecraft.broadcastCleanEmbed({ message: `Player \`${user}\` not found.`, color: 'DC143C' })
		}

		if (this.isNoHistoryMessage(message)) {
			return this.minecraft.broadcastCleanEmbed({ message: `There is no recent history to display.`, color: '6495ED' })
		}

		if (this.isNoGEXPMessage(message)) {
			return this.minecraft.broadcastCleanEmbed({ message: message, color: '6495ED' })
		}

		if (this.isGuildLogMessage(message)) {
			let rawMessage = message.split('\n').splice(1, message.split('\n').length - 2)
			const title = rawMessage.shift().replace(/[<>]/g, '').trim()

			Object.entries(rawMessage).forEach(str => {
				if (str[1]?.includes(':')) {
					const unix = Date.parse(str[1].match(/\b(?<month>[A-Z]{3})\s(?<date>[0-9]{2})\s(?<year>[0-9]{4})\s(?<time>[:0-9]+)\s(?<zone>[A-Z]{3})/gi))
					const action = str[1].split(':').pop().trim()

					rawMessage[str[0]] = `**<t:${unix / 1000}:f>:** ${action}`
				}
			})

			this.minecraft.broadcastTitleEmbed({ message: rawMessage.join('\n'), title: title, color: '6495ED' })
		}

		if (this.isDiscordMessage(message)) {
			let rawMessage = message.split('\n').splice(1, message.split('\n').length - 2)
			const title = rawMessage.splice(0, 2).join(' - ').match(/\D\S+/gi, '').join('')
			console.log(title)

			Object.entries(rawMessage).forEach(str => {
				if (str[1]?.includes('discord.gg')) {
					if (!str[1].includes('https://')) {
						rawMessage[str[0]] = `[[discord link](https://${str[1]})]`
					} else {
						rawMessage[str[0]] = ` [[discord link](${domain_url})]`
					}
				}
			})

			this.minecraft.broadcastTitleEmbed({ message: rawMessage.join('\n'), title: title, color: '6495ED' })
		}

		if (this.isGuildMessage(message) || this.isOfficerMessage(message)) {
			this.minecraft.app.discord.currChannel.shift()

			let parts = message.split(':')
			let group = parts.shift().trim()
			let hasRank = group.endsWith(']')

			let userParts = group.split(' ')
			let chatType = userParts[0].toLowerCase()
			let username = userParts[userParts.length - (hasRank ? 2 : 1)]
			let guildRank = userParts[userParts.length - 1].replace(/[\[\]]/g, '')

			if (guildRank == username) {
				guildRank = 'Member'
			}

			if (this.isMessageFromBot(username)) {
				return
			}

			const playerMessage = parts.join(':').trim()
			if (playerMessage.length == 0 || this.command.handle(username, playerMessage)) {
				return
			}

			if (playerMessage == '@') {
				return
			}

			this.minecraft.broadcastMessage({
				username: username,
				message: playerMessage,
				guildRank: guildRank,
				chatType: chatType,
			})
		}

		if (this.isEmbedMessage(message)) {
			this.collect = !this.collect
			let string_Col = this.msg_col.toString()

			if (this.msg_col.length == 0) {
				return
			}

			if (!this.collect && string_Col.includes('Guild') && (string_Col.includes('Members') || string_Col.includes('Experience'))) {
				const guildName = this.msg_col.shift().split(':').pop()
				Object.entries(this.msg_col).forEach(str => {
					if (str[1]?.includes(':')) {
						let tempString = str[1].split(':')

						if (tempString[1]) {
							tempString[0] = `**${tempString[0]}**`
							tempString[1] = `\`${tempString
								.slice(1)
								.reduce((prev, curr) => prev + ':' + curr)
								.trim()}\``

							this.msg_col[str[0]] = tempString[0] + ': ' + tempString[1]
						} else {
							tempString[0] = `\n\u200B__${tempString[0]}__`
							this.msg_col[str[0]] = tempString[0] + ':'
						}
					}
					if (str[1]?.includes('--')) {
						let tempString = str[1].replace(/[^a-zA-Z ]/g, '').trim()
						this.msg_col[str[0]] = `__${tempString}__`
					}
					if (str[1]?.includes('●')) {
						this.msg_col[str[0]] = `\`\`\`prolog\n${str[1]}\`\`\``
					}
				})

				this.minecraft.broadcastTitleEmbed({ message: this.msg_col.join('\n'), title: guildName, color: '6495ED' })
			} else if (!this.collect && string_Col.includes('Guild History')) {
				const title = this.msg_col.shift()
				Object.entries(this.msg_col).forEach(str => {
					if (str[1]?.includes(':')) {
						const unix = Date.parse(str[1].match(/\b(?<month>[A-Z]{3})\s(?<date>[0-9]{2})\s(?<year>[0-9]{4})\s(?<time>[:0-9]+)\s(?<zone>[A-Z]{3})/gi))
						const action = str[1].split(':').pop().trim()

						this.msg_col[str[0]] = `**<t:${unix / 1000}:f>:** ${action}`
					}
				})

				this.minecraft.broadcastTitleEmbed({ message: this.msg_col.join('\n'), title: title, color: '6495ED' })
			} else if (!this.collect) {
				this.msg_col.length <= 1
					? this.minecraft.broadcastCleanEmbed({ message: this.msg_col.join('\n'), color: '6495ED' })
					: this.minecraft.broadcastTitleEmbed({ message: this.msg_col.join('\n'), title: this.msg_col.shift(), color: '6495ED' })
			}

			this.msg_col = []

			return
		} else if (this.collect) {
			return this.msg_col.push(message)
		}
	}

	isMessageFromBot(username) {
		return this.bot.username === username
	}

	isLobbyJoinMessage(message) {
		return (message.endsWith(' the lobby!') || message.endsWith(' the lobby! <<<')) && message.includes('[MVP+')
	}

	isFailedChatMessage(message) {
		return message == 'Missing arguments! Usage: /achat message'
	}

	isGuildMessage(message) {
		return message.startsWith('Guild >') && message.includes(':')
	}

	isOfficerMessage(message) {
		return message.startsWith('Officer >') && message.includes(':')
	}

	isSlowMessage(message) {
		return message.startsWith('Guild >') && message.includes('chat throttle!')
	}

	isLoginMessage(message) {
		return message.startsWith('Guild >') && message.endsWith('joined.') && !message.includes(':')
	}

	isLogoutMessage(message) {
		return message.startsWith('Guild >') && message.endsWith('left.') && !message.includes(':')
	}

	isJoinMessage(message) {
		return message.includes('joined the guild!') && !message.includes(':')
	}

	isLeaveMessage(message) {
		return message.includes('left the guild!') && !message.includes(':')
	}

	isKickMessage(message) {
		return message.includes('was kicked from the guild by') && !message.includes(':')
	}

	isPromotionMessage(message) {
		return message.includes('was promoted from') && !message.includes(':')
	}

	isDemotionMessage(message) {
		return message.includes('was demoted from') && !message.includes(':')
	}

	isOnlineModeMessage(message) {
		return message.includes('guild online mode!') && !message.includes(':')
	}

	isBlockedMessage(message) {
		return message.includes('We blocked your comment') && !message.includes(':')
	}

	isNoGEXPMessage(message) {
		return message.includes('No one earned guild experience') && !message.includes(':')
	}

	isNoHistoryMessage(message) {
		return message == 'There is no recent history to display.' && !message.includes(':')
	}

	isPageError(message) {
		return message == 'Page must be between 1 and 4.'
	}

	isRepeatMessage(message) {
		return message == 'You cannot say the same message twice!'
	}

	isNoPermission(message) {
		return (
			(message.includes('You must be the Guild Master to use that command!') ||
				message.includes('You do not have permission to use this command!') ||
				message.includes(
					"I'm sorry, but you do not have permission to perform this command. Please contact the server administrators if you believe that this is in error."
				) ||
				message.includes('You cannot mute a guild member with a higher guild rank!') ||
				message.includes('You cannot kick this player!') ||
				message.includes('You can only promote up to your own rank!') ||
				message.includes('You cannot mute yourself from the guild!') ||
				message.includes("is the guild master so can't be demoted!") ||
				message.includes("is the guild master so can't be promoted anymore!")) &&
			!message.includes(':')
		)
	}

	isIncorrectUsage(message) {
		return message.includes('Invalid usage!') && !message.includes(':')
	}

	isOnlineInvite(message) {
		return message.includes('You invited') && message.includes('to your guild. They have 5 minutes to accept.') && !message.includes(':')
	}

	isOfflineInvite(message) {
		return (
			message.includes('You sent an offline invite to') &&
			message.includes('They will have 5 minutes to accept once they come online!') &&
			!message.includes(':')
		)
	}

	isFailedInvite(message) {
		return (
			(message.includes('is already in another guild!') ||
				message.includes('You cannot invite this player to your guild!') ||
				(message.includes("You've already invited") && message.includes('to your guild! Wait for them to accept!')) ||
				message.includes('is already in your guild!')) &&
			!message.includes(':')
		)
	}

	isUserMuteMessage(message) {
		return message.includes('has muted') && message.includes('for') && !message.includes(':')
	}

	isUserUnmuteMessage(message) {
		return message.includes('has unmuted') && !message.includes(':')
	}

	isGuildMuteMessage(message) {
		return message.includes('has muted the guild chat for') && !message.includes(':')
	}

	isGuildUnmuteMessage(message) {
		return message.includes('has unmuted the guild chat!') && !message.includes(':')
	}

	isGuildNotMuted(message) {
		return message.includes('The guild is not muted!') && !message.includes(':')
	}

	isSetrankFail(message) {
		return message.includes("I couldn't find a rank by the name of ") && !message.includes(':')
	}

	isAlreadyMuted(message) {
		return message.includes('This player is already muted!') && !message.includes(':')
	}

	isNotInGuild(message) {
		return message.includes(' is not in your guild!') && !message.includes(':')
	}

	isHighestRank(message) {
		return message.includes("is already the highest rank you've created!") && !message.includes(':')
	}

	isLowestRank(message) {
		return message.includes("is already the lowest rank you've created!") && !message.includes(':')
	}

	isAlreadyHasRank(message) {
		return message.includes('They already have that rank!') && !message.includes(':')
	}

	isTooFast(message) {
		return message.includes('You are sending commands too fast! Please slow down.') && !message.includes(':')
	}

	isPlayerNotFound(message) {
		return message.startsWith(`Can't find a player by the name of`) && !message.includes(':')
	}

	isPartyInvite(message) {
		return message.includes('has invited you to join their party!') && !message.includes(':')
	}

	isGuildNotifications(message) {
		return message.includes('guild join/leave notifications!') && !message.includes(':')
	}

	isGuildLogMessage(message) {
		let tempString = message.split('\n')[1]
		return tempString?.includes('Guild Log') && !tempString?.includes(':')
	}

	isDiscordMessage(message) {
		let tempString = message.split('\n')[2]
		return tempString?.includes('DISCORD') && !tempString?.includes(':')
	}

	isEmbedMessage(message) {
		return message == '-----------------------------------------------------'
	}

	isAPIMessage(message) {
		return message.includes('Your new API key is') && !message.includes(':')
	}
}

module.exports = StateHandler
