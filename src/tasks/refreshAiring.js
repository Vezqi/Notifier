module.exports = {
    enabled: false,
    run: ({
        cron,
        database,
        request
    }) => {
        cron.schedule('30 */5 * * * *', async () => {
            try {
                console.log('Running airing show refresh task...');
                let data = await request.fetchCurrentlyAiringData();
                await database.refreshShows(data);
                console.log('Airing show refresh task completed successfully.');
            } catch (e) {
                console.error(`Airing show refresh task failed: ${e}`);
            }
        }, {
            scheduled: false
        }).start();
    }
}