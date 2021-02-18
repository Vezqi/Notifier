module.exports = {
    enabled: true,
    run: ({
        cron,
        database,
        client,
        config,
        utils
    }) => {
        cron.schedule('30 */5 * * * *', async () => {
            try {
                console.log('Checking for new nyaa links...');
                let rawLinks = await database.checkForNewNyaaLinks();
                if (rawLinks.length >= 1) {
                    let links = rawLinks.reverse();
                    let serverGuid = links.length > 1 ? links[links.length - 1].guid : links[0].guid;
                    for (var link of links) {
                        let time = await utils.getMessageTimeFormat();
                        if (link.category === 'Anime - English-translated') {
                            console.log(`${link.title} | ${link.url}`);
                            await client.channels.cache.get(config.nyaaFeedChannel).send(`\`[${time}]\` ${link.title} | ${link.url}`);
                        }
                        database.setMostRecentNyaaGuid(serverGuid);
                        console.log(`Successfully set most recent nyaa guid to ${serverGuid}`);
                    }
                }
            } catch (e) {
                console.error(`Failed to check for new Nyaa links: ${e}`);
            }
        }, {
            scheduled: false
        }).start();
    }
}