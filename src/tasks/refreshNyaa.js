const cron = require('node-cron');
const request = require('../internal/request'),
    database = require('../internal/database'),
    utils = require('../utils'),
    fs = require('fs');

require('dotenv').config;

module.exports = {
    enabled: true,
    run: 
        cron.schedule('*/60 * * * * *', async () => {
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
        })
}