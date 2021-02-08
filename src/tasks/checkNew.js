const cron = require('node-cron');
const database = require('../internal/database');

module.exports = {
    enabled: true,
    run: cron.schedule('*/60 * * * * *', async () => {
        console.log('Checking for new shows...');
        let shows = await database.checkNew();
        for (var show of shows) {
            console.log(`A new episode of ${show.name} has released!`);
            await client.channels.cache.get(process.env.notificationChannel).send(`\`$[${moment.HTML5_FMT.TIME_SECONDS}]\` A new episode of ${show.name} has released!`);
        }
    }, {
        scheduled: false
    })
}