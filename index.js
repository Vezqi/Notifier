const fs = require('fs'),
      tasks = fs.readdirSync('./src/tasks').filter((task) => task.endsWith('.js')),
      commands = fs.readdirSync('./src/commands').filter((cmd) => cmd.endsWith('.js')),
      Discord = require('discord.js'),
      client = new Discord.Client(),
      cron = require('node-cron'),
      request = require('./src/internal/request'),
      database = require('./src/internal/database'),
      utils = require('./src/utils'),
      moment = require('moment'),
      momentTz = require('moment-timezone'),
      got = require('got'),
      config = require('dotenv').config().parsed

// Need to initialize 'other' table nyaa column with value.
require('./src/internal/database').init();

client.commands = new Discord.Collection();

let numTasks = 0,
    numEnabled = 0,
    listOfTasks = '',
    enabledTasks = '';

for(const _cmd of commands) {
    let command = require(`./src/commands/${_cmd}`);
    client.commands.set(command.name, command);
}

for (const _task of tasks) {
    numTasks += 1;
    listOfTasks += _task + ' ';
    let task = require(`./src/tasks/${_task}`);
    if (task.enabled) {
        numEnabled += 1;
        enabledTasks += _task + ' ';
        task.run({
            client: client,
            config: config,
            cron: cron,
            request: request,
            database: database,
            utils: utils,
            moment: moment,
            momentTz: momentTz,
            got: got,
            Discord: Discord
        });
    }
}

client.on('ready', () => {
    require('./src/listeners/ready').run(client);
});

client.on('message', async(message) => {
    if(!message.content.startsWith(config.prefix) || message.author.bot) return;
    const args = message.content.slice(config.prefix.length).split(/\s+/),
          cmdName = args.shift().toLowerCase();

    if(!client.commands.has(cmdName)) return;

    const cmd = client.commands.get(cmdName);

    if(cmd.adminOnly && message.author.id !== '192956988764848128') {
        return await message.channel.send('This command is currently restricted to developers only.');
    }

    if(cmd.WIP) {
        return await message.channel.send('This command is a work in progress.');
    }

    if (cmd.args && !args.length && cmd.needsArgs) {
    	let reply = `You didn't provide any arguments, ${message.author.username}!\n`;

    	if (cmd.usage) {
    		reply += `\nUsage: \`${config.prefix}${cmd.name} ${cmd.usage}\``;
    	}

    	return await message.channel.send(reply);
    }

    try {
        await cmd.run({
            message: message,
            request: request,
            args: args,
            Discord: Discord,
            client: client,
            config: config,
            database: database,
            utils: utils,
            moment: moment,
            momentTz: momentTz,
            got: got
        });
    } catch(e) {
        console.error(e);
        await message.reply('there was an error trying to execute that command.');
    }

});

console.log(`Total tasks [${numTasks}]: ${listOfTasks}\nEnabled tasks [${numEnabled}]: ${enabledTasks}`)
client.login(process.env.token);