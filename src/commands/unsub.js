module.exports = {
    name: 'unsub', 
    description: 'Unsubscribes a user from a show previously subscribed to.',
    usage: '[show name]',
    args: true,
    needsArgs: true,
    run: async({ database, args, message }) => {
        let showName = args.join(' ').toLowerCase();
        try {
            await database.unsub(message.author.id, showName);
            await message.react('✅');
        } catch(e) {
            await message.react('❌');
            console.log(`Failed to unsubscribe user from show: ${e}`);
        }
    }
}