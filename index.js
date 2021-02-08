const fs = require('fs');
const tasks = fs.readdirSync('./src/tasks').filter((file) => file.endsWith('.js'));

const utils = require('./src/utils');
const Discord = require('discord.js'),
      client = new Discord.Client();

require('dotenv').config()

client.on('ready', () => console.log('Connected to Discord!'));

// Need to figure out how to do this in TypeScript. This will determine if we move forward with the TS version. ↓

for(var task of tasks) {
    let registeredTask = require(`./src/tasks/${task}`);
    if(registeredTask.enabled) {
        registeredTask.run.start();
        console.log(`${task} started`);
    }
}

client.login(process.env.token);