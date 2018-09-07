require('date-utils');

const app = require('../app');
const { km, nhkeq } = require('../lib/eq');
const discord = require('../modules/discord');
const discord_config = require('../config/discord');

exports.km = () => {
  const ei = km();

  if(ei) {
    if(ei.report_id < app.startup_time) {
      console.log(`modules.eq[km] : skipped report of before start up`);
      return;
    } // 起動時の時間より前の発表を無視する(#2)

    if(!(ei.report_id in app.eq_list)) {
      console.log(`modules.eq[km] : new eq`);
      app.eq_list[ei.report_id] = [];
    }

    if(app.eq_list[ei.report_id].indexOf(ei.report_num) === -1) {
      console.log(`modules.eq[km] : new eq report`);
      app.eq_list[ei.report_id].push(ei.report_num);

      const send_message = {
        embed: {
          title: `地震速報(高度利用) 第${ei.report_num}報`,
          color: parseInt("0xff0000", 16),
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

      const notify_channel = [discord_config.notify_channel];
      if(
        ei.calcintensity >= discord_config.emergency_notify_calcintensity &&
        ei.report_num === '1'
      ) notify_channel.push(discord_config.emergency_notify_channel);
      
      notify_channel.forEach(channel => {
        discord.client.channels
          .get(channel)
          .send(send_message);
      });
    }
  }
}

exports.nhk = () => {
  nhkeq()
    .then(eq_data => {
      if(eq_data.$.Epicenter === '') {
        console.log(`nhkeq : skipped beta report`)
        return;
      }
      
      if(app.nhkeq_list.indexOf(eq_data.$.Id) !== -1) {
        // console.log(`nhkeq : skipped duplicate data`);
        return;
      }
      app.nhkeq_list.push(eq_data.$.Id);

      const timestamp = new Date(eq_data.$.Time);

      if(timestamp < app.startup_time) {
        console.log(`modules.eq[nhk] : skipped report of before start up`);
        return;
      } // 起動時の時間より前の発表を無視する(#2)

      console.log(`modules.eq[nhk] : new eq`);
      discord.client.channels
        .get('487259165660545036')
        .send(
          {
            embed: {
              color: parseInt('0xff0000', 16),
              title: `NHK地震情報 ${eq_data.$.Id}`,
              description: `${eq_data.$.Time}頃、${eq_data.$.Epicenter}で、最大震度${eq_data.$.Intensity}の揺れを観測する地震がありました。\n震源の深さは${eq_data.$.Depth}。地震の規模を示すマグニチュードは、${eq_data.$.Magnitude}と推定されています。`,
              image: {
                url: `https://www3.nhk.or.jp/sokuho/jishin/${eq_data.Detail[0]}`
              }
            }
          }
        );
  });
}