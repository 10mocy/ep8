const discord = require('../modules/discord')
const discordConfig = require('../config/discord')

module.exports = msg => {
  console.log(msg)
  discord.client.channels
    .get(discordConfig.logChannel)
    .send(msg)
}