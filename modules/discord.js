require('date-utils')

const Discord = require('discord.js')
const client = new Discord.Client()
exports.client = client

const discord_config = require('../config/discord')

const eq = require('../modules/eq')
const cmd = require('../lib/cmd.js')

exports.init = () => {
  client.login(discord_config.token)

  client.on('ready', () => {
    console.log(`modules.discord[ready] : logged in as ${client.user.tag}!`)
    
    console.log('modules.discord[ready] : starting eq steram...')
    eq.km() // 高度利用者向け地震情報
    eq.nhk() // NHK地震情報
    setInterval(eq.km, 500)
    setInterval(eq.nhk, 1000 * 30)
  
    client.user.setActivity('日本の地下で眠っています……')
  })

  client.on('message', msg => {
    if (msg.author.id === client.user.id) {
      // console.log(`modules.discord[message] : skipped my message`)
      return
    }

    if (msg.channel.id === discord_config.control_channel) {
      cmd.control(msg) // コントロールコマンド
    } else {
      // console.log(msg.content)
      cmd.general(msg) // どのチャンネルでも実行できるコマンド
    }
  })

}
