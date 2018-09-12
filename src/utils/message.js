const generalConfig = require('../../.config/general')
const discordModule = require('../modules/discord')

const datetimeToDate = datetime => {
  const regDate = datetime.match(/([0-9]{4})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})/)
  if(regDate === null) return false
  return `${regDate[1]}/${regDate[2]}/${regDate[3]} ${regDate[4]}:${regDate[5]}:${regDate[6]}`
}

exports.broadcast = message => {

  const services = generalConfig.services

  if(services.discord) discordModule.sendMessage(message.discord)

  if(services.slack) console.log(message.slack)

  if(services.line) console.log(message.line)

  if(services.misskey) console.log(message.misskey)
  
}

exports.formatKyoshin = data => {
  
  let def
  
  def  = `【地震速報(高度利用) 第${data.report_num}報】\n`
  def += `発生時刻 : ${data.origin_time}\n`
  def += `震源 : ${data.region_name}\n`
  def += `深さ : ${data.depth}\n`
  def += `最大震度 : ${data.calcintensity}\n`
  def += `強さ(M) : M${data.magunitude}`

  let discord = def, slack = def, line = def, misskey = def

  discord = {
    embed: {
      title: `地震速報(高度利用) 第${data.report_num}報`,
      color: parseInt('0xff0000', 16),
      fields: [
        { name: '発生時刻',
          value: datetimeToDate(data.origin_time),
          inline: true },
        { name: '震央',
          value: data.region_name,
          inline: true },
        { name: '深さ',
          value: data.depth,
          inline: true },
        { name: '強さ(M)',
          value: `M${data.magunitude}`,
          inline: true },
        { name: '予想最大震度',
          value: `震度${data.calcintensity}`,
          inline: true }
      ]
    }
  }
  return { discord, slack, line, misskey }
}