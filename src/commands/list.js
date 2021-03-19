module.exports = {
    name: 'list',
    description: 'Lists shows users are currently subscribed to.',
    usage: '[user id] (optional)',
    args: true,
    needsArgs: false,
    run: async({ message, args, database, utils, Discord }) => {
        
        let targetId = typeof args[0] === 'undefined' ? message.author.id : args[0],
            subscriptions = await database.listSubscriptions(targetId),
            color = utils.randColor(),
            description = '';

        if(subscriptions.length === 0) {
           return await message.reply('nothing found for that user :(');
        }

        for(var sub of subscriptions) {
            description += `${sub.Title} | Added by <@${sub.UserID}>\n`;
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(`Notification Alert List`)
            .setDescription(description)
            .setColor(color);

        await message.channel.send(embed);

    }
}