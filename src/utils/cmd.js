const app = require('../app')
const log = require('./log')

const discordConfig = require('../config/discord')
const generalConfig = require('../config/general')

exports.control = msg => {
  const message = msg.content

  if(message.match(/変数出力/)) {
    log('utils.cmd[control] : 変数出力')
    msg.channel.send({
      embed: {
        color: parseInt('0xffffff', 16),
        description: 'わたしが今持っている変数です！',
        fields: [
          { name: 'startupTime',
            value: app.startupTime,
            inline: true },
          { name: 'eqList',
            value: `\`\`\`${JSON.stringify(app.eqList)}\`\`\``,
            inline: true },
          { name: 'nhkeqList',
            value: `\`\`\`${JSON.stringify(app.nhkeqList)}\`\`\``,
            inline: true },
          { name: 'discordConfig.notifyChannel',
            value: discordConfig.notifyChannel,
            inline: true },
          { name: 'discordConfig.emergencyNotifyChannel',
            value: discordConfig.emergencyNotifyChannel,
            inline: true },
          { name: 'discordConfig.emergencyNotifyCalcintensity',
            value: discordConfig.emergencyNotifyCalcintensity,
            inline: true },
          { name: 'discordConfig.controlChannel',
            value: discordConfig.controlChannel,
            inline: true }
        ]
      }
    })
  }
  else if(message.match(/落ちろ/)) {
    log('utils.cmd[control] : 落ちろ')
    msg.channel
      .send('出直してきます！')
      .then(() => {
        process.exit(0)
      })
  }
  else if(message.match(/テスト/)) {
    const dt = new Date()
    dt.setSeconds(dt.getSeconds() -3)
    const date = dt.toFormat('YYYYMMDD')
    const time = dt.toFormat('YYYYMMDDHH24MISS')
    log(date, time)
  }
}

exports.general = msg => {
  const message = msg.content

  if(message.match(/誰が管理/)) {
    log('utils.cmd[general] : 誰が管理')
    msg.channel.send(`${generalConfig.owner}さんです！`)
  }
  else if(message.match(/リポジトリのURL/)) {
    log('utils.cmd[general] : リポジトリのURL')
    msg.channel.send(`${generalConfig.repository} です！`)
  }
  else if(message.match(/問題の報告|機能の追加/)) {
    log('utils.cmd[general] : 問題の報告')
    msg.channel.send(`${generalConfig.issues} からお願いします！`)
  }
  else if(message.match(/変数出力/)) {
    log('utils.cmd[general] : 変数出力')
    msg.channel.send('ここで言うのは少し恥ずかしいので、別の場所でお願いします…///')
  }
  else if(message.match(/落ちろ/)) {
    log('utils.cmd[general] : 落ちろ')
    msg.channel.send('Botに落ちろとか言ってるから女子さえ落とせないんですよ！')
  }
  
}