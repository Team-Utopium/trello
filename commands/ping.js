const Discord = require('discord.js'),
      db = require('quick.db')

const config = require('/home/sd/utopium/wwou-staff/util/config'),
      fn = require('/home/sd/utopium/wwou-staff/util/fn')

module.exports = {
  name: "ping",
  aliases: [],
  run: async (client, message, args, shared) => {    
    let m = await message.channel.send("Pinging...")
    
    let botLatency = Math.abs(m.createdTimestamp - message.createdTimestamp),
        ping = client.ws.ping,
        memory = (process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(2)
    
    let embed = new Discord.MessageEmbed()
      .setTitle(`Bot Status`)
      .setThumbnail(client.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
      .addField("Bot Latency", `${botLatency}ms`, true)
      .addField("Ping", `${Math.round(ping)}ms`, true)
      .addField("Memory Used", `${memory}MB`, true)
    .setFooter(client.user.username)
    .setTimestamp()
    
    m.delete()
    await message.channel.send(embed)
  }
}