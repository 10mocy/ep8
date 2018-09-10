require('date-utils')

const log = require('../utils/log')

const Discord = require('discord.js')
const client = new Discord.Client()
exports.client = client

const discordConfig = require('../config/discord')

const eq = require('../modules/eq')
const cmd = require('../utils/cmd')

exports.init = () => {
  client.login(discordConfig.token)

  client.on('ready', () => {
    log(`modules.discord[ready] : logged in as ${client.user.tag}!`)
    
    log('modules.discord[ready] : starting eq steram...')
    eq.km() // 高度利用者向け地震情報
    eq.nhk() // NHK地震情報
    setInterval(eq.km, 500)
    setInterval(eq.nhk, 1000 * 15)
  
    client.user.setActivity('日本の地下で眠っています……')
  })

  client.on('message', msg => {
    if (msg.author.id === client.user.id) {
      // log(`modules.discord[message] : skipped my message`)
      return
    }

    if (msg.channel.id === discordConfig.controlChannel) {
      cmd.control(msg) // コントロールコマンド
    } else {
      // log(msg.content)
      cmd.general(msg) // どのチャンネルでも実行できるコマンド
    }
  })

}
