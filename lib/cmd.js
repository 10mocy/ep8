const general_config = require('../config/general');

exports.control = (msg) => {
    if (/変数出力/.test(msg.content)) {
      console.log(`lib.cmd[control] : 変数出力`);
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
            { name: 'nhkeq_list',
              value: `\`\`\`${JSON.stringify(nhkeq_list)}\`\`\``,
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
      console.log(`lib.cmd[control] : 落ちろ`);
      msg.channel
        .send(`出直してきます！`)
        .then(message => {
          process.exit(0);
        });
    }
}

exports.general = (msg) => {
  if(/誰が管理/.test(msg.content)) {
    console.log(`lib.cmd[general] : 誰が管理`);
    msg.channel.send(`${general_config.owner}さんです！`);
  }
  else if(/変数出力/.test(msg.content)) {
    console.log(`lib.cmd[general] : 変数出力`);
    msg.channel.send(`ここで言うのは少し恥ずかしいので、別の場所でお願いします…///`)
  }
  else if(/リポジトリのURL/.test(msg.content)) {
    console.log(`lib.cmd[general] : リポジトリのURL`);
    msg.channel.send(`${general_config.repository} です！`);
  }
  else if(/問題の報告|機能の追加/.test(msg.content)) {
    console.log(`lib.cmd[general] : 問題の報告`);
    msg.channel.send(`${general_config.issues} からお願いします！`);
  }

  /* ネタ枠(別Bot化を検討) */
  else if(msg.content === '神') {
    console.log(`lib.cmd[general] : 神`);
    msg.channel.send('てへへ');
  }
  else if(msg.content === '草') {
    console.log(`lib.cmd[general] : 草`);
    msg.react('🌿');
  }
  else if(msg.content === 'かわいい') {
    msg.react('❤');
    console.log(`lib.cmd[general] : かわいい`);
    msg.channel.send('ありがとうございます！');
  }
  else if(/は？/.test(msg.content)) {
    console.log(`lib.cmd[general] : は？`);
    msg.react('🤔');
  }
  else if(/[♡❤]/.test(msg.content)) {
    console.log(`lib.cmd[general] : :heart:`);
    msg.react('❤');
  }
  else if(/[✌]/.test(msg.content)) {
    console.log(`lib.cmd[general] : :tada:`);
    msg.react('🎉');
  }
}