const discord = require('../modules/discord')
const discordConfig = require('../config/discord')

module.exports = (...args) => {

  let message = ''

  args.forEach(msg => {
    message += `${msg} `
  })

  discord.client.channels
    .get(discordConfig.logChannel)
    .send(`** log ** ${message}`)
}