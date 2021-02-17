const Discord = require("discord.js"),
  fn = require("/home/sd/utopium/wwou-staff/util/fn"),
  db = require("quick.db")

const { axios, trello, tconfig } = require("../trello.js")

module.exports = {
  name: "wurole",
  usage: "wurole",
  run: async (client, message, args, shared) => {
    if (
      !client.guilds.cache
        .get("522638136635817986")
        .members.cache.get(message.author.id)
        .roles.cache.find((r) =>
          ["*", "Bot Helper", "Developer", "Writers Utopia Staff"].includes(
            r.name
          )
        )
    )
      return undefined

    let fields = [
      "Name",
      "Aura",
      "Team",
      "Icon Description",
      "Replaces",
      "Win Condition",
      "Ability",
      "In-game Description",
      "Interactions",
      "Pros",
      "Cons",
    ]
    let data = {}
    for await (let x of fields) {
      let prompt = await message.author.send(
        new Discord.MessageEmbed()
          .setTitle(x)
          .setDescription(`What is the ${x} of this role?`)
      )

      let res = await prompt.channel
        .awaitMessages((msg) => msg.author.id == message.author.id, {
          time: 120 * 1000,
          max: 1,
          errors: ["time"],
        })
        .catch(() => {})
      if (!res)
        return await message.author.send(
          new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("Prompt timed out.")
        )
      res = res.first().content
      data[x] = res
    }

    let descformatted = `**Name**: ${data["Name"]}
**Aura**: ${data["Aura"]}
**Team**: ${data["Team"]}
**Icon**: ${data["Icon Description"]}
**Replaces**: ${data["Replaces"]}
**Win Condition**: ${data["Win Condition"]}\x0A\x0A### Ability
${data["Ability"]}\x0A\x0A### In-game Description
${data["In-Game Description"]}\x0A\x0A### Interactions
${data["Interactions"]}\x0A\x0A### Pros
${data["Pros"]}\x0A\x0A### Cons
${data["Cons"]}`
    message.channel.send(descformatted)
    let req =
      "/cards?idList=" +
      tconfig.lists.writersutopia +
      "&idLabels=" +
      [tconfig.labels.wureview] +
      "&name=" +
      data.name +
      "&desc=" +
      descformatted +
      "&pos=top"
    let t = await trello.post(encodeURI(req))
    console.log(encodeURI(req))
    message.channel.send(t.data.url)
  },
}
