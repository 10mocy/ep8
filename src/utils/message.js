const generalConfig = require('../../.config/general')
const discordModule = require('../modules/discord')
const lineModule = require('../modules/line')

const datetimeToDate = datetime => {
  const regDate = datetime.match(/([0-9]{4})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})/)
  if(regDate === null) return false
  return `${regDate[1]}/${regDate[2]}/${regDate[3]} ${regDate[4]}:${regDate[5]}:${regDate[6]}`
}

exports.broadcast = message => {

  const services = generalConfig.services

  if(services.discord) discordModule.sendMessage(message.discord)

  if(services.slack) console.log(message.slack)

  if(services.line) lineModule.sendMessage(message.line)

  if(services.misskey) console.log(message.misskey)
  
}

exports.formatKyoshin = data => {
  
  let def
  
  def  = `【地震速報(高度利用) 第${data.report_num}報】\n`
  def += `発生時刻 : ${datetimeToDate(data.origin_time)}\n`
  def += `震源 : ${data.region_name}\n`
  def += `深さ : ${data.depth}\n`
  def += `最大震度 : ${data.calcintensity}\n`
  def += `強さ(M) : M${data.magunitude}`

  let discord = def, slack = def, line = def, misskey = def

  // Discord用データの定義
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

  // LINE用データの定義
  line = `${(new Date(datetimeToDate(data.origin_time))).toFormat('HH24:MI')} [第${data.report_num}報] ${data.region_name}で地震発生 最大震度${data.calcintensity}`

  return { discord, slack, line, misskey }

}

exports.formatNHK = data => {

  const maxIntensityAreaData = data.Relative[0].Group[0].Area
  let maxIntensityArea = ''

  // #region 最大震度を観測した地域を文字列化する
  maxIntensityAreaData.forEach(area => {
    maxIntensityArea += `\n・${area.$.Name}`
  })
  // #end region

  const def = `【NHK】${(new Date(data.$.Time).toFormat('DD日 HH24:MI'))}頃、${data.$.Epicenter}で、最大震度${data.$.Intensity}の揺れを観測する地震がありました。\n震源の深さは${data.$.Depth}。地震の規模を示すマグニチュードは、${data.$.Magnitude}と推定されています。`
  let discord = def, slack = def, line = def, misskey = def

  // Discord用データの定義
  discord = {
    embed: {
      color: parseInt('0xff0000', 16),
      title: `NHK地震情報 ${data.$.Id}`,
      fields: [
        { name: '発生時刻',
          value: data.$.Time,
          inline: true },
        { name: '震央',
          value: data.$.Epicenter,
          inline: true },
        { name: '深さ',
          value: data.$.Depth,
          inline: true },
        { name: '強さ(M)',
          value: `M${data.$.Magnitude}`,
          inline: true },
        { name: '最大震度',
          value: `震度${data.$.Intensity}`,
          inline: true },
        { name: `最大震度${data.$.Intensity}を観測した地域`,
          value: maxIntensityArea,
          inline: true }
      ],
      image: {
        url: `https://www3.nhk.or.jp/sokuho/jishin/${data.Detail[0]}`
      }
    }
  }

  return { discord, slack, line, misskey }

}