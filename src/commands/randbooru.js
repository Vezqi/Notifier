module.exports = {
    name: 'randbooru',
    description: 'Sends a random image from danbooru.',
    args: false,
    needsArgs: false,
    usage: '',
    run: async ({ message, request, args, Discord, utils }) => {
        let res = await request.getRandomDanbooruImage();
        let src = res.source === 'https://' ? 'None' : `https://${res.src}`;
        let color = utils.randColor();
        let embed = new Discord.MessageEmbed()
            .setTitle(res.alt)
            .setImage(res.img)
            .setColor(color)
            .addField('Post', `[Link](${res.postUrl})`, true)
            .addField('Rating', res.rating, true)
            .addField('Favorites', res.favorites, true)
            .addField('Score', res.score, true)
            .addField('Size', `${res.size} (${res.dimensions.width}x${res.dimensions.height})`, true)
            // .addField('Source', `[Link](${src})`, true) Returning undefined. :(

        await message.channel.send(embed);

    }
}