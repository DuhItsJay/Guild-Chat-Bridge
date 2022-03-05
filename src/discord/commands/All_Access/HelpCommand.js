const fs = require('fs')

const DiscordCommand = require('../../../contracts/DiscordCommand')
const { version } = require('../../../../package.json')

class HelpCommand extends DiscordCommand {
	constructor(discord) {
		super(discord)

		this.name = 'help'
		this.aliases = ['h']
		this.description = 'Shows this help menu'
	}

	onCommand(message) {
		let discordCommands = []
		let minecraftCommands = []
		let all_access_folder_length = fs.readdirSync('./src/discord/commands/All_Access').length

		this.discord.messageHandler.command.commands.forEach(command => {
			discordCommands.push(`\`${command.name}\`: ${command.description}`)
		})

		this.discord.app.minecraft.chatHandler.command.commands.forEach(command => {
			minecraftCommands.push(`\`${command.name}\`: ${command.description}`)
		})

		message.channel
			.send({
				embed: {
					title: 'Help',
					description: ['`< >` = Required arguments', '`[ ]` = Optional arguments'].join('\n'),
					fields: [
						{
							name: '**__Discord Commands__**\nAll Access',
							value: discordCommands.slice(0, all_access_folder_length).join('\n'),
						},
						{ name: 'Staff', value: discordCommands.slice(all_access_folder_length, discordCommands.length - 1).join('\n'), inline: true },
						{
							name: 'Minecraft Commands',
							value: minecraftCommands.join('\n'),
						},
						{
							name: `Info`,
							value: [
								`Prefix: \`${this.discord.app.config.discord.prefix}\``,
								`Guild Channel: <#${this.discord.app.config.discord.guildChannel}>`,
								`Command Role: <@&${this.discord.app.config.discord.commandRole}>`,
								`Version: \`${version}\``,
							].join('\n'),
						},
					],
					color: message.guild.me.displayHexColor,
					footer: {
						text: 'Made by Senither and neyoa ❤ modified by DuhItsJay :>',
					},
					timestamp: new Date(),
				},
			})
			.then(helpMessage => {
				helpMessage.delete({ timeout: 30000 })
			})
	}
}

module.exports = HelpCommand
