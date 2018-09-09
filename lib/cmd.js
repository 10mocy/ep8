const app = require('../app')
const discordConfig = require('../config/discord')
const generalConfig = require('../config/general')

exports.control = msg => {
  if (/変数出力/.test(msg.content)) {
    console.log('lib.cmd[control] : 変数出力')
    msg.channel.send({
      embed: {
        color: parseInt('0x222222', 16),
        description: 'わたしが今持っている変数です！',
        fields: [
          { name: 'startup_time',
            value: app.startup_time,
            inline: true },
          { name: 'eq_list',
            value: `\`\`\`${JSON.stringify(app.eq_list)}\`\`\``,
            inline: true },
          { name: 'nhkeq_list',
            value: `\`\`\`${JSON.stringify(app.nhkeq_list)}\`\`\``,
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
  else if(/落ちろ/.test(msg.content)) {
    console.log('lib.cmd[control] : 落ちろ')
    msg.channel
      .send('出直してきます！')
      .then(() => {
        process.exit(0)
      })
  }
}

exports.general = msg => {
  if(/誰が管理/.test(msg.content)) {
    console.log('lib.cmd[general] : 誰が管理')
    msg.channel.send(`${generalConfig.owner}さんです！`)
  }
  else if(/リポジトリのURL/.test(msg.content)) {
    console.log('lib.cmd[general] : リポジトリのURL')
    msg.channel.send(`${generalConfig.repository} です！`)
  }
  else if(/問題の報告|機能の追加/.test(msg.content)) {
    console.log('lib.cmd[general] : 問題の報告')
    msg.channel.send(`${generalConfig.issues} からお願いします！`)
  }
  else if(/変数出力/.test(msg.content)) {
    console.log('lib.cmd[general] : 変数出力')
    msg.channel.send('ここで言うのは少し恥ずかしいので、別の場所でお願いします…///')
  }
  else if(/落ちろ/.test(msg.content)) {
    console.log('lib.cmd[general] : 落ちろ')
    msg.channel.send('Botに落ちろとか言ってるから女子さえ落とせないんですよ！')
  }
  
}