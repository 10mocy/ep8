const token = require('./config/discord_token');
const Discord = require('discord.js');
const client = new Discord.Client();
const request = require('request');
require('date-utils');

const notify_channel = '487171776049315851';
let eq_list = {
  "dummy": 0
};

const kyoshinMonitor = () => {
  
  /* リクエスト用日付データ生成 */
  const date = new Date();
  const time = date.toFormat('YYYYMMDDHH24MISS');

  /* リクエスト用データ作成 */
  const options = {
    url: `http://www.kmoni.bosai.go.jp/new/webservice/hypo/eew/${time}.json`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    json: true
  }

  /* リクエスト */
  request(options, (error, response, body) => {

    // TODO: 起動時より前の情報は無視

    if(body.result.message !== '') return; // 地震発生時のみ抽出
    if(body.report_num !== '1' && !body.is_final) return; // 第一報と最終報のみ抽出
    if(body.report_id in eq_list && eq_list[body.report_id] >= 1) return; // 重複チェック

    if(!(body.report_id in eq_list)) {
      eq_list[body.report_id] = 0;
    }
    eq_list[body.report_id]++; // 実行回数をカウントする

    // TODO: 震度計情報などのマップをごにょごにょして添付する

    console.log(body);
    sendMessage(
      client.channels.get(notify_channel),
      {
        embed: {
          description: `地震速報(高度利用) 第${body.report_num}報`,
          color: parseInt("0xff0000", 16),
          fields: [
            {
              name: '発生時刻',
              value: body.origin_time,
              inline: true
            },
            {
              name: '震央',
              value: body.region_name,
              inline: true
            },
            {
              name: '深さ',
              value: body.depth,
              inline: true
            },
            {
              name: '強さ(M)',
              value: `M${body.magunitude}`,
              inline: true
            },
            {
              name: '予想最大震度',
              value: `震度${body.calcintensity}`,
              inline: true
            }
          ],
          footer: `テスト`
        }
      }
    );
  });
}

const sendMessage = (channel, message, option = null) => {
  channel.send(message, option);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  setInterval(kyoshinMonitor, 500);
  client.user.setActivity("日本の地下で眠っています……");
  sendMessage(client.channels.get(notify_channel), 'ぷはっ！',
  {
    embed: {
      color: parseInt("0x00ff00", 16),
      description: '高度利用者向け地震情報に接続しました。'
    }
  })
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