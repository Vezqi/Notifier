module.exports = {
	name: 'eval',
	description: 'Evaluates JavaScript code.',
	adminOnly: true,
	run: async({ message, args }) => {
		const clean = (text) => {
		    if (typeof (text) === 'string') {
		        return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
		    } else {
		        return text;
		    }
		}

	    try {
	        let code = args.join(' '),
	              evaled = eval(code);

	        if (typeof evaled !== 'string') {
                evaled = require('util').inspect(evaled);
            }

	        await message.channel.send(clean(evaled), {
	            code: 'js'
	        });
	    } catch (err) {
	        message.channel.send(`\`ERROR\` \`\`\`js\n${clean(err)}\n\`\`\``);
	    }
	},
};