module.exports = {
    enabled: true,
    run: ({
        client,
        cron,
        database,
        moment,
        config
    }) => {
        cron.schedule('*/45 * * * * *', async () => {
            try {
                console.log('Checking for new shows...');
                let shows = await database.checkForNewEpisodes();
                let time = await utils.getCurrentTimeFormatted();
                for (var show of shows) {
                    console.log(`A new episode of ${show.name} has released!`);
                    await client.channels.cache.get(config.notificationChannel).send(`\`[${time}]\` A new episode of ${show.name} has released!`);
                }
            } catch (e) {
                console.error(`Failed to check for new episodes: ${e}`);
            }
        }, {
            scheduled: false
        }).start();
    }
}