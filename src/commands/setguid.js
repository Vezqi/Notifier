module.exports = {
	name: 'setguid',
	description: 'Updates the most recent Nyaa feed item\'s GUID in the database.',
	adminOnly: true,
	args: true,
	needsArgs: true,
	run: async({ message, args, database }) => {
		let val = parseInt(args[0]);

		if(Number.isNaN(val)) {
			return await message.reply('GUID must me an integer!')
		} else {
			let setVal = await database.setMostRecentNyaaGuid(val);
			await message.channel.send(`Successfully updated Nyaa GUID value to \`${val}\`.`);
		}

	},
};