const axios = require("axios")
const tconfig = {
    board: "6015412db6cfef56c17b4993",
    lists: {
        "writersutopia": "602a129470b44857960edbf3",
        "newbugs": "60154136d557da6f65140656",
        "feedback": "6029cfad224e5e2e18daea78"
    },
    labels: {
        "wureview": "602a2692ed3d673ad47112a8"
    }
}
const trello = axios.create({
  baseURL: "https://api.trello.com/1",
  timeout: 1000,
  params: {
      key: process.env.trellokey,
      token: process.env.trellotoken
  }
})

module.exports = { axios, trello, tconfig }
