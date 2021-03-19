module.exports = {
    enabled: true,
    run: ({
        cron,
        database,
        client,
        config,
        utils,
        Discord
    }) => {
        cron.schedule('30 */5 * * * *', async () => {
            try {
                console.log('Checking for new nyaa links...');
                let rawLinks = await database.checkForNewNyaaLinks();
                if (rawLinks.length >= 1) {
                    let links = rawLinks.reverse();
                    let serverGuid = links.length > 1 ? links[links.length - 1].guid : links[0].guid;
                    console.log(links);
                    for (var link of links) {
                        let color = utils.randColor();
                        if (link.category === 'Anime - English-translated') {
                            let embed = new Discord.MessageEmbed()
                                .setTitle('New upload on Nyaa.si')
                                .setURL(link.url)
                                .setColor(color)
                                .addField('Seeders', link.seeders, true)
                                .addField('Leechers', link.leechers, true)
                                .addField('Downloads', link.downloads, true)
                                .addField('Size', link.size, true)
                                .addField('Comments', link.comments, true)
                                .addField('Trusted', link.trusted, true)
                                .setFooter(`${link.date} | ${link.guid} - ${link.hash}`);

                            await client.channels.cache.get(config.nyaaFeedChannel).send(embed);
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