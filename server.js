const { DiscordAPIError } = require("discord.js")
const express = require("express")
const app = express()
const client = require("./client.js")
const trello = require("./trello.js")
const { MessageEmbed } = require("discord.js")
app.use(require("body-parser").json())

let updatechan = client.channels.cache.get(trello.tconfig.discord.updatechan)
let embedt = new MessageEmbed().setColor(0x708ad7).setTimestamp()
//.setThumbnail(client.user.avatarURL())

app.post("/trelloCallback", (req, res) => {
    let embed = embedt
    console.log(JSON.stringify(req.body, null, 2))
    let x = req.body
    updatechan.send(JSON.stringify(x, null, 2), { split: ",", code: "json" })
    if (
        x.action.type == "addLabelToCard" &&
        x.action.data.text == "Needs Information"
    ) {
        updatechan.send(
            embed
                .setTitle("A card has been labeled as Needing Information!")
                .setDescription(
                    `Card Title: \`${x.action.data.card.name}\`\n\nUpdated by: ${x.action.memberCreator.username}\n`
                )
                .setURL("https://trello.com/c/" + x.action.data.card.url)
        )
    }
    if (
        x.action.type == "updateCard" &&
        x.action.data.listAfter.name == "To Be Tested"
    ) {
        updatechan.send(
            embed
                .setTitle("A card is ready to be tested!")
                .setDescription(
                    `Card Title: \`${x.action.data.card.name}\`\n\nUpdated by: ${x.action.memberCreator.username}\n`
                )
                .setURL("https://trello.com/c/" + x.action.data.card.url)
        )
    }
    res.sendStatus(200)
})

app.get("/trelloCallback", (req, res) => {
    res.sendStatus(200)
})

const listener = app.listen(43452, () => {
    console.log(
        "trello.utopium.tk is online, using port " + listener.address().port
    )
})
