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
      {var: "Aura", allowed: ["good", "evil", "unknown"]},
      "Team",
      "Icon Description",
      {var: "Replaces", q: "What does this role replace?"},
      "Win Condition",
      "Ability",
      "In-game Description",
      {var: "Interactions", q: "What are the interactions of this role?"},
      {var: "Pros", q: "What are the pros of this role?"},
      {var: "Cons", q: "What are the cons of this role?"},
      {var: "Additional Info", q: "Any additional info? Reply with the info or say \"None\""}
    ]
    let data = {}, q = "", allowed = []
    for await (let x of fields) {
      if(typeof x == "object") {
        q = x.q ? x.q : "", allowed = x.allowed ? x.allowed : [], x = x.var
      }
      while(!data[x]){
      let prompt = await message.author.send(
        new Discord.MessageEmbed()
          .setTitle(x)
          .setDescription(q ? q : `What is the ${x} of this role?`.toLowerCase())
      )
      q = ""

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
      res.first().delete()
      prompt.delete()
      res = res.first().content

      if(allowed.length > 0 && !allowed.includes(res.toLowerCase())) {
        message.channel.send(`That isn't a valid ${x}!`.toLowerCase()).then(m => setTimeout(() => m.delete(), 10000))
      } else {
        data[x] = res
      }
        }
    }

    let descformatted = `**Name**: ${data["Name"]}
**Aura**: ${data["Aura"]}
**Team**: ${data["Team"]}
**Icon**: ${data["Icon Description"]}
**Replaces**: ${data["Replaces"]}
**Win Condition**: ${data["Win Condition"]}

**Ability**
${data["Ability"]}

**In-game Description**
${data["In-game Description"]}

**Interactions**
${data["Interactions"]}

**Pros**
${data["Pros"]}

**Cons**
${data["Cons"]}

**Other Information**
${data["Other Information"]}`

    //message.channel.send(descformatted)
    let req =
      "/cards?idList=" +
      tconfig.lists.writersutopia +
      "&idLabels=" +
      [tconfig.labels.wureview] +
      "&name=" +
      data["Name"] +
      "&desc=" +
      descformatted +
      "&pos=top"
    let t = await trello.post(encodeURI(req))
    console.log(encodeURI(req))
    message.channel.send(t.data.url)
  },
}
