require('date-utils')
const discord = require('./modules/discord')

let eqList = { }
let nhkeqList = []

exports.eqList = eqList
exports.nhkeqList = nhkeqList
exports.startupTime = (new Date()).toFormat('YYYYMMDDHH24MISS')

console.log('app[main] : welcome to ep8!')

discord.init()
