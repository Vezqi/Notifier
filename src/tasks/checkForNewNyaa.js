const cron = require('node-cron');
const request = require('../internal/request'),
    database = require('../internal/database');


module.exports = {
    enabled: true,
    run: cron.schedule('5 */1 * * * *', async () => {
        try {
            console.log('Checking for new nyaa links...');
            let links = await database.checkForNewNyaaLinks();
            for (var link of links) {
                console.log(`New link on https://nyaa.si: ${link.title} | ${link.url}`);
                await client.channels.cache.get(process.env.nyaaFeedChannel).send(`New link on https://nyaa.si: ${link.title} | ${link.url}`);
            }
        } catch (e) {
            console.error(`Failed to check for new Nyaa links: ${e}`);
        }
    }, {
        scheduled: false
    })
}