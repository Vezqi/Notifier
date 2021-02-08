const cron = require('node-cron');
const request = require('../internal/request'),
      database = require('../internal/database');

module.exports = {
    enabled: true,
    run: cron.schedule('30 */5 * * * *', async () => {
        try {
            console.log('Running refresh task...');
            let data = await request.fetchWebData();
            await database.refresh(data);
            console.log('Refresh task completed successfully.');
        } catch (e) {
            console.error(`Refresh task failed: ${e}`);
        }
    }, {
         scheduled: false
    })
}