const momentTz = require('moment-timezone');
const { compareNyaaTimestamp } = require('./src/utils');
const utils = require('./src/utils');
const db = require('./src/internal/database');
const request = require('./src/internal/request');

const checkTimes = async(localTime, serverTime) => {
   let formattedServerTime = momentTz.tz(serverTime, 'America/Los_Angeles').format('HH:mm');
   return (localTime === formattedServerTime) ? true : false;
}

(async() => {
   let localTime = await utils.formatLocalTimeAsNyaaTimestamp();
   console.log(localTime);



   console.log('--------');
   console.log(utils.formatNyaaTimestamp('Sun, 14 Feb 2021 00:14:59 -0000'))
   console.log(utils.formatNyaaTimestamp('Sun, 14 Feb 2021 00:14:59 -0000') === localTime)

    await request.checkNyaaNew();


})();