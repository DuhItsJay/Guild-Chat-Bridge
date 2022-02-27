const DiscordCommand = require('../../../contracts/DiscordCommand')

class NotificationCommand extends DiscordCommand {
	constructor(discord) {
		super(discord)

		this.name = 'notifications'
		this.aliases = ['notify', 'notif']
		this.description = 'Changes Join/Leave log settings for the guild'
	}

	onCommand(message) {
		this.sendMinecraftMessage(`/g notifications`)
	}
}

module.exports = NotificationCommand
