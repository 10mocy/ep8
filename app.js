require('date-utils');
const startup_time = (new Date()).toFormat('YYYYMMDDHH24MISS');

const general_config = require('./config/general');
const discord_config = require('./config/discord');

const km = require('./lib/km');

const Discord = require('discord.js');
const client = new Discord.Client();

let eq_list = { };

client.on('ready', () => {
  console.log(`app[ready] : Logged in as ${client.user.tag}!`);

  setInterval(() => {
    
    const ei = km();
    // console.log(ei);

    if(ei) {
      // console.log(eq_list);
      if(ei.report_id < startup_time) {
        console.log(`app[message] : skipped report of before start up`);
        return;
      } // 起動時の時間より前の発表を無視する(#2)

      if(!(ei.report_id in eq_list)) {
        console.log(`app[setInterval] : new eq`);
        eq_list[ei.report_id] = [];
      }

      if(eq_list[ei.report_id].indexOf(ei.report_num) === -1) {
        console.log(`app[setInterval] : new eq report`);
        eq_list[ei.report_id].push(ei.report_num);

        client.channels
          .get(discord_config.notify_channel)
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
  // client.channels
  //   .get(discord_config.notify_channel)
  //   .send(
  //     {
  //       embed: {
  //         color: parseInt("0x00ff00", 16),
  //         description: '高度利用者向け地震情報に接続しました。'
  //       }
  //   });
});

client.on('message', msg => {
  if (msg.author.id === client.user.id) {
    console.log(`app[message] : skipped my message`);
    return;
  }

  if (msg.channel.id === discord_config.control_channel) {
    /* 以下コンパネ用設定 */
    if (/変数出力/.test(msg.content)) {
      console.log(`app[message]<control> : 変数出力`);
      msg.channel.send({
        embed: {
          color: parseInt("0x222222", 16),
          description: 'わたしが今持っている変数です！',
          fields: [
            { name: 'startup_time',
              value: startup_time,
              inline: true },
            { name: 'eq_list',
              value: `\`\`\`${JSON.stringify(eq_list)}\`\`\``,
              inline: true },
            { name: 'discord_config.notify_channel',
              value: discord_config.notify_channel,
              inline: true },
            { name: 'discord_config.control_channel',
              value: discord_config.control_channel,
              inline: true }
          ]
        }
      });
    }
    else if(/落ちろ/.test(msg.content)) {
      console.log(`app[message]<control> : 落ちろ`);
      msg.channel
        .send(`出直してきます！`)
        .then(message => {
          process.exit(0);
        });
    }
  } else {
    /* どのチャンネルでも実行できるコマンド */
    // console.log(msg.content);

    if(/誰が管理/.test(msg.content)) {
      console.log(`app[message] : 誰が管理`);
      msg.channel.send(`${general_config.owner}さんです！`);
    }
    else if (/変数出力/.test(msg.content)) {
      console.log(`app[message] : 変数出力`);
      msg.channel.send(`ここで言うのは少し恥ずかしいので、別の場所でお願いします…///`)
    }
    else if(/リポジトリのURL/.test(msg.content)) {
      console.log(`app[message] : リポジトリのURL`);
      msg.channel.send(`${general_config.repository} です！`);
    }
    else if(/問題の報告|機能の追加/.test(msg.content)) {
      console.log(`app[message] : 問題の報告`);
      msg.channel.send(`${general_config.issues} からお願いします！`);
    }
    else if (msg.content === '神') {
      console.log(`app[message] : 神`);
      msg.channel.send('てへへ');
    }
    else if (msg.content === 'かわいい') {
      msg.react('❤');
      console.log(`app[message] : かわいい`);
      msg.channel.send('ありがとうございます！');
    }

    /* 半分ネタ枠 */
    else if(/は？/.test(msg.content)) {
      console.log(`app[message] : は？`);
      msg.react('🤔');
    }
    else if(/[♡❤]/.test(msg.content)) {
      console.log(`app[message] : :heart:`);
      msg.react('❤');
    }
  }

});


client.login(discord_config.token);