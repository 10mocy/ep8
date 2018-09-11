const Earthquake = require('./modules/earthquake')
const eq = new Earthquake()

eq.on('start', () => {
  console.log('[app]<start> welcome to ep8!')
})

eq.on('kyoshin', data => {
  console.log(data)
})

eq.on('nhk', data => {
  console.log(data)
})

eq.on('data', message => console.log(`[app]<data> ${message}`))

eq.start()
