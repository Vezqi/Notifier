module.exports = {
    enabled: true,
    run: ({
        cron,
        database,
        client,
        config
    }) => {
        cron.schedule('30 */5 * * * *', async () => {
            try {
                console.log('Checking for new nyaa links...');
                let rawLinks = await database.checkForNewNyaaLinks();
                let links = rawLinks.reverse();
                let serverGuid = links[links.length - 1].guid;
                for (var link of links) {
                    console.log(`New link on https://nyaa.si: ${link.title} | ${link.url}`);
                    await client.channels.cache.get(config.nyaaFeedChannel).send(`New link on https://nyaa.si: ${link.title} | ${link.url}`);
                    database.setMostRecentNyaaGuid(serverGuid);
                    console.log(`Successfully set most recent nyaa guid to ${serverGuid}`);
                }
            } catch (e) {
                console.error(`Failed to check for new Nyaa links: ${e}`);
            }
        }, {
            scheduled: false
        }).start();
    }
}