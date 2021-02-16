const Discord = require("discord.js"),
  fn = require("/home/sd/utopium/wwou-staff/util/fn"),
  db = require("quick.db")

const {axios, trello, tconfig} = require("../trello.js")

module.exports = {
  name: "wurole",
  usage: "wurole <title>;<description>",
  run: async (client, message, args, shared) => {
    if (
      !client.guilds.cache
        .get("522638136635817986")
        .members.cache.get(message.author.id)
        .roles.cache.find((r) =>
          ["*", "Bot Helper", "Developer", "Writers Utopia Staff"].includes(r.name)
        )
    )
      return undefined
      let submit = args.join(" ")
      submit = submit.split(";")
      let title = submit[0], desc = submit[1]


      let req = '/cards?idList=' + tconfig.lists.writersutopia + '&idLabels=' + [tconfig.labels.wureview] + '&name=' + title + '&desc=' + desc + '&pos=top'
     trello.post(encodeURI(req)).then(console.log)
  }
}
