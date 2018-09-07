const token = require('./config/discord_token');
const Discord = require('discord.js');
const client = new Discord.Client();
const request = require('request');
require('date-utils');

const notify_channel = '487171776049315851';

const eew_info = () => {
  /* リクエスト用日付データ生成 */
  const date = new Date();
  const time = date.toFormat('YYYYMMDDHH24MISS');

  /* リクエスト用データ作成 */
  const options = {
    url: `http://www.kmoni.bosai.go.jp/new/webservice/hypo/eew/${time}.json`,
    method: 'GET',
    json: true
  }

  /* リクエスト */
  request(options, (error, response, body) => {
    if(body.result.message === '') {
      return body;
    } else {
      return false;
    }
  });
}

let eq_list = { };

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  setInterval(() => {
    let ei;
    if(ei = eew_info()) {
      if(!(ei.report_id in eq_list)) {
        eq_list[ei.report_id] = [];
      }

      if(!(ei.report_num in eq_list[ei.report_id])) {
        eq_list[ei.report_id].push(ei.report_num);

        client.channels
          .get(notify_channel)
          .send(
            {
              embed: {
                description: `地震速報(高度利用) 第${body.report_num}報`,
                color: parseInt("0xff0000", 16),
                fields: [
                  { name: '発生時刻',
                    value: body.origin_time,
                    inline: true },
                  { name: '震央',
                    value: body.region_name,
                    inline: true },
                  { name: '深さ',
                    value: body.depth,
                    inline: true },
                  { name: '強さ(M)',
                    value: `M${body.magunitude}`,
                    inline: true },
                  { name: '予想最大震度',
                    value: `震度${body.calcintensity}`,
                    inline: true }
                ]
              }
            }
          );
      }
    }
  }, 500);

  client.user.setActivity("日本の地下で眠っています……");
  client.channels
    .get(notify_channel)
    .send(
      {
        embed: {
          color: parseInt("0x00ff00", 16),
          description: '高度利用者向け地震情報に接続しました。'
        }
    });
});

client.on('message', msg => {
  if (msg.author.id === client.user.id) return;
  if (msg.channel.id != "487171776049315851") return;
  if (msg.content === 'ping') {
    msg.channel.send('Pong!');
  } else if (msg.content === '神') {
    msg.channel.send('てへへ');
  }
});


client.login(token.discord_token);