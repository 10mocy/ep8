require('date-utils');
const startup_time = new Date();

const token = require('./config/discord_token');
const km = require('./lib/km');

const Discord = require('discord.js');
const client = new Discord.Client();

const notify_channel = '487259165660545036';

let eq_list = { };

client.on('ready', () => {
  console.log(`app[ready] : Logged in as ${client.user.tag}!`);

  setInterval(() => {
    console.log(`app[setInterval]`);
    
    const ei = km();
    // console.log(ei);

    if(ei) {
      // console.log(eq_list);

      if(!(ei.report_id in eq_list)) {
        console.log(`app[setInterval] : new eq`);
        eq_list[ei.report_id] = [];
      }

      if(eq_list[ei.report_id].indexOf(ei.report_num) === -1) {
        console.log(`app[setInterval] : new eq report`);
        eq_list[ei.report_id].push(ei.report_num);

        client.channels
          .get(notify_channel)
          .send(
            {
              embed: {
                description: `地震速報(高度利用) 第${ei.report_num}報`,
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
  if (msg.author.id === client.user.id) {
    console.log(`app[message] : skipped my message`);
    return;
  }

  if (msg.channel.id != notify_channel) {
    console.log(`app[message] : skipped different channel`);
    return;
  }
  
  if (msg.content === 'ping') {
    msg.channel.send('Pong!');
  } else if (msg.content === '神') {
    msg.channel.send('てへへ');
  }
});


client.login(token.discord_token);