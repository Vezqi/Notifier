module.exports = {
    enabled: false,
    run: ({
        cron,
        request,
        database
    }) => {
        cron.schedule('*/5 * * * *', async () => {
            try {
                console.log('Running nyaa refresh task...');
                let nyaaFeedData = await request.checkNyaaNew();
                await database.refreshNyaa(nyaaFeedData);
                console.log('Nyaa refresh task completed successfully.')

            } catch (e) {
                console.error(`Nyaa refresh task failed: ${e}`);
            }

        }, {
            scheduled: false
        }).start();
    }
}