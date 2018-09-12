const Earthquake = require('./modules/earthquake')
const Message = require('./utils/message')

const eq = new Earthquake()

eq.on('start', () => {

  console.log('[app] start > welcome to ep8!')

})

eq.on('kyoshin', data => {

  Message.broadcast(Message.formatKyoshin(data))

  console.log('[app] kyoshin > new earthquake report')

})

eq.on('nhk', data => {

  Message.broadcast(Message.formatNHK(data))

  console.log('[app] nhk > new earthquake report')

})

eq.on('data', message => console.log(`[app] data > ${message}`))

eq.start()
