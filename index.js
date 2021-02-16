require('dotenv').config()
require('es6-shim')
const Discord = require('discord.js'),
      fs = require("fs"),
      db = require("quick.db")

const {axios, trello, tconfig} = require("./trello.js")

const client = new Discord.Client(),
      config = require('/home/sd/utopium/wwou-staff/util/config'),
      fn = require('/home/sd/utopium/wwou-staff/util/fn'),
      cmd = require('node-cmd')

client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	client.commands.set(command.name, command)
}

const token = process.env.DISCORD_BOT_TOKEN



/* --- ALL GLOBAL CONSTANTS & FUNCTIONS --- */

client.login(token)

client.once('ready', async () => {
  console.log(`${fn.time()} | ${client.user.username} is up!`)
})

client.on('message', async message => {
  
  if (message.author.bot) return;
  
  const msg = message.content.trim().toLowerCase()
  
  const prefix = "t!"
  
  let shared = {}
    
  if (message.content.toLowerCase().startsWith(prefix)) {
    
    var args = message.content.trim().slice(prefix.length).split(/\s+/u)
    shared.prefix = prefix
    
		const commandName = args.shift().toLowerCase()
		shared.commandName = commandName
		const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))

		if (!command) return;
    
		try {
			await command.run(client, message, args, shared)
		} catch (error) {
			console.log(error)
		}
    
    message.delete().catch(error => {})
	}
})

