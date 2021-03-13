module.exports = {
    name: 'help',
    description: 'List of all the commands or info about a specified command.',
    usage: '[command]',
    run: async({ message, args, config })  => {
        const { commands } = message.client;
        const { prefix } = config;
        const data = [];

        if(!args.length) {
            data.push(`Commands: ${commands.map((c) => c.name).join(', ')}`);
            data.push(`\nYou can use \`${prefix}help [command]\` to learn more about a specific command.`);
        } else {
            if(!commands.has(args[0])) {
                return await message.channel.send('That command does not exist.');
            }

            const command = commands.get(args[0]);

            data.push(`**Name:** ${command.name}`);

            if (command.description) data.push(`**Description:** ${command.description}`);
        	if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        }

        await message.channel.send(data);

    }
}