const cron = require('node-cron');
const database = require('../internal/database');

module.exports = {
    enabled: false,
    run:
        cron.schedule('*/60 * * * * *', async () => {
            try {
                console.log('Checking for new shows...');
                let shows = await database.checkForNewEpisodes();
                for (var show of shows) {
                    console.log(`A new episode of ${show.name} has released!`);
                    await client.channels.cache.get(process.env.notificationChannel).send(`\`$[${moment.HTML5_FMT.TIME_SECONDS}]\` A new episode of ${show.name} has released!`);
                }
            } catch (e) {
                console.error(`Failed to check for new episodes: ${e}`);
            }
        }, {
            scheduled: false
        })
}