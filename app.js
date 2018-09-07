require('date-utils');
const discord = require('./modules/discord');

exports.startup_time = (new Date()).toFormat('YYYYMMDDHH24MISS');

console.log(`app[main] : welcome to ep8!`);

discord();
