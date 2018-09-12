const Discord = require('discord.js')
const discord = new Discord.Client()
const discordConfig = require('../../.config/discord')

let isLogin = false

discord.login(discordConfig.token)

discord.on('ready', () => {

  console.log('[modules.discord] ready > ok')
  isLogin = true

})

discord.on('message', () => {})

exports.sendMessage = message => {


  if(isLogin) {

    console.log('[modules.discord] sendMessage > isLogin')

    discord.channels
      .get(discordConfig.notifyChannel)
      .send(message)

  } else {
    console.log('[modules.discord] sendMessage > !isLogin')
  }

}
