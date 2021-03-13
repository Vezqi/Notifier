module.exports = {
    name: 'ping',
    description: 'Ping the bot!',
    args: false,
    needsArgs: false,
    usage: '',
    run: async({ message, args }) => {
        let invokeTime = new Date().getTime(),
            sent = await message.channel.send('Pong!'),
            sentTime = new Date().getTime(),
            timeDiff = sentTime - invokeTime;

        await sent.edit(`Pong! Took ${(timeDiff / 1000).toFixed(2)}s`);

    }
}