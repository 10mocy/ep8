require('date-utils')
const discord = require('./modules/discord')

let eq_list = { }
let nhkeq_list = []

exports.eq_list = eq_list
exports.nhkeq_list = nhkeq_list
exports.startup_time = (new Date()).toFormat('YYYYMMDDHH24MISS')

console.log('app[main] : welcome to ep8!')

discord.init()
