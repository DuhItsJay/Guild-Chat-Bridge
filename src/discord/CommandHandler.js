const fs = require('fs')
const { Collection } = require('discord.js-light')

class CommandHandler {
	constructor(discord) {
		this.discord = discord

		this.prefix = discord.app.config.discord.prefix

		this.commands = new Collection()
		let directories = fs.readdirSync('./src/discord/commands')

		for (const dir of directories) {
			let commandFiles = fs.readdirSync(`./src/discord/commands/${dir}`).filter(file => file.endsWith('.js'))

			for (const file of commandFiles) {
				const command = new (require(`./commands/${dir}/${file}`))(discord)
				this.commands.set(command.name, command)
			}
		}
	}

	handle(message) {
		if (!message.content.startsWith(this.prefix)) {
			return false
		}

		let args = message.content.slice(this.prefix.length).trim().split(/ +/)
		let commandName = args.shift().toLowerCase()

		let command = this.commands.get(commandName) || this.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

		if (!command) {
			return false
		}

		var staffCommands = fs.readdirSync('./src/discord/commands/Staff')

		if ((command.name == 'override' && !this.isOverrideUser(message.member)) || (staffCommands.includes(command.name) && !this.isCommander(message.member))) {
			return message.channel.send({
				embed: {
					description: `You don't have permission to do that.`,
					color: 'DC143C',
				},
			})
		}

		this.discord.app.log.discord(`[${command.name}] ${message.content}`)
		command.onCommand(message)

		return true
	}

	isCommander(member) {
		return member.roles.cache.find(r => r.id == this.discord.app.config.discord.commandRole)
	}

	isOverrideUser(member) {
		return member.user.id == this.discord.app.config.discord.overrideRole || member.roles.cache.find(r => r.id == this.discord.app.config.discord.overrideRole)
	}
}

module.exports = CommandHandler
