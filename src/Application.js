//Call Bot Configuration, Class Managers and Logger
const Configuration = require('./Configuration')
const DiscordManager = require('./discord/DiscordManager')
const MinecraftManager = require('./minecraft/MinecraftManager')
const Logger = require('./Logger')

class Application {
	async register() {
		//Function register contructs new Objects for each of the above called classes
		this.config = new Configuration()
		this.log = new Logger()
		this.discord = new DiscordManager(this)
		this.minecraft = new MinecraftManager(this)

		/*
    Enables communication between the two classes
    Makes it possible to call one function part of another class w/ invoking circular references
    */
		this.discord.setBridge(this.minecraft)
		this.minecraft.setBridge(this.discord)
	}

	async connect() {
		//Creates Discord Bot Client
		this.discord.connect()
		//Creates Minecraft Bot Client
		this.minecraft.connect()
	}
}

module.exports = new Application()
