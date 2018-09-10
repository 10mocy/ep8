require('date-utils')
const async = require('async')

const app = require('../app')
const log = require('../utils/log')

const { km, nhkeq } = require('../utils/eq')
// const generateMap = require('../utils/generate-map')

const discord = require('./discord')
const discordConfig = require('../config/discord')

exports.km = () => {
  const ei = km()

  if(ei) {
    if(ei.report_id < app.startupTime) {
      // log(`modules.eq[km] : skipped report of before start up`)
      return
    } // 起動時の時間より前の発表を無視する(#2)

    if(!(ei.report_id in app.eqList)) {
      log('modules.eq[km] : new eq')
      app.eqList[ei.report_id] = []
    }

    if(app.eqList[ei.report_id].indexOf(ei.report_num) === -1) {
      log('modules.eq[km] : new eq report')
      app.eqList[ei.report_id].push(ei.report_num)

      let sendMessage = {
        embed: {
          title: `地震速報(高度利用) 第${ei.report_num}報`,
          color: parseInt('0xff0000', 16),
          fields: [
            { name: '発生時刻',
              value: ei.origin_time,
              inline: true },
            { name: '震央',
              value: ei.region_name,
              inline: true },
            { name: '深さ',
              value: ei.depth,
              inline: true },
            { name: '強さ(M)',
              value: `M${ei.magunitude}`,
              inline: true },
            { name: '予想最大震度',
              value: `震度${ei.calcintensity}`,
              inline: true }
          ]
        }
      }

      // generateMap()
      //   .then((err, imagePath) => {
      //     sendMessage.image = {
      //       url: 'attachment://eq.png'
      //     }
      //     sendMessage.files = [{attachment: imagePath, name: 'eq.png'}]
      //   }
      //   )
      
      // log(JSON.stringify(sendMessage))

      const notifyChannel = [discordConfig.notifyChannel]
      if(
        ei.calcintensity >= discordConfig.emergency_notifyCalcintensity &&
        ei.report_num === '1'
      ) notifyChannel.push(discordConfig.emergency_notifyChannel)
      
      notifyChannel.forEach(channel => {
        discord.client.channels
          .get(channel)
          .send(sendMessage)
      })

    }
  }
}

exports.nhk = () => {
  nhkeq()
    .then(eqData => {
      const time = new Date(eqData.$.Time)
      const timestamp = time.toFormat('YYYYMMDDHH24MISS')

      if(timestamp < app.startupTime) {
        // log(`modules.eq[nhk] : skipped report of before start up`)
        return
      } // 起動時の時間より前の発表を無視する(#2)

      if(eqData.$.Epicenter === '') {
        log('nhkeq : skipped beta report')
        return
      } // 確定情報でなければ無視する
      
      if(app.nhkeqList.indexOf(eqData.$.Id) !== -1) {
        // log('nhkeq : skipped duplicate data')
        return
      }
      app.nhkeqList.push(eqData.$.Id)

      log('modules.eq[nhk] : new eq')

      const maxIntensityAreaData = eqData.Relative[0].Group[0].Area
      let maxIntensityArea = `最大震度${eqData.Relative[0].Group[0].$.Intensity}を観測した地域は以下の通りです。`
      
      // #region 最大震度を観測した地域を文字列化する
      async.each(maxIntensityAreaData, area => {
        maxIntensityArea += `\n・${area.$.Name}`
      })
      // #end region

      discord.client.channels
        .get(discordConfig.notifyChannel)
        .send(
          {
            embed: {
              color: parseInt('0xff0000', 16),
              title: `NHK地震情報 ${eqData.$.Id}`,
              description: `${eqData.$.Time}頃、${eqData.$.Epicenter}で、最大震度${eqData.$.Intensity}の揺れを観測する地震がありました。\n震源の深さは${eqData.$.Depth}。地震の規模を示すマグニチュードは、${eqData.$.Magnitude}と推定されています。\n\n${maxIntensityArea}`,
              image: {
                url: `https://www3.nhk.or.jp/sokuho/jishin/${eqData.Detail[0]}`
              }
            }
          }
        )
    })
}