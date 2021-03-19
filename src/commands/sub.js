module.exports = {
    name: 'sub',
    description: 'Subscribes you to receive notifications for new episodes of currently airing shows.',
    usage: '[show]',
    args: true,
    needsArgs: true,
    run: async({ database, args, message }) => {
        let showName = args.join(' ');
        try {
            await database.sub(message.author.id, showName);
            await message.react('✅');
        } catch(e) {
            await message.react('❌');
            console.log(`Failed to subscribe user to show: ${e}`);
        }
    }
}