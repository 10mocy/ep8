const discord = require('../modules/discord')
const discordConfig = require('../config/discord')

module.exports = msg => {
  const message = msg

  console.log(message)
  discord.client.channels
    .get(discordConfig.logChannel)
    .send(`** log ** ${message}`)
}