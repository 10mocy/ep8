const Request = require('request')
const lineConfig = require('../../.config/line')

exports.sendMessage = message => {

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${lineConfig.token}`
  }

  const options = {
    url: 'https://api.line.me/v2/bot/message/push',
    method: 'POST',
    headers,
    json: {
      to: 'Uf991457fd0a22066fb8f0ee97e4c8f2c',
      messages: [
        { type: 'text', text: message }
      ]
    }
  }

  Request(options, err => {

    if(!err) console.log('[modules.line] sendMessage > sent message')

  })

}