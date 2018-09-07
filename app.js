require('date-utils');
const Discord = require('discord.js');
client = new Discord.Client();

const eq = require('./modules/eq');
const cmd = require('./lib/cmd.js');

const discord_config = require('./config/discord');

exports.startup_time = (new Date()).toFormat('YYYYMMDDHH24MISS');
exports.client = client;

client.on('ready', () => {
  console.log(`app[ready] : logged in as ${client.user.tag}!`);

  console.log(`app[ready] : starting eq steram...`)
  setInterval(eq.km, 500); // 高度利用者向け地震情報
  setInterval(eq.nhk, 1000 * 30); // NHK地震情報

  client.user.setActivity("日本の地下で眠っています……");
});

client.on('message', msg => {
  if (msg.author.id === client.user.id) {
    console.log(`app[message] : skipped my message`);
    return;
  }

  if (msg.channel.id === discord_config.control_channel) {
    cmd.control(msg); // コントロールコマンド
  } else {
    // console.log(msg.content);
    cmd.general(msg); // どのチャンネルでも実行できるコマンド
  }

});

client.login(discord_config.token);