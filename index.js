const fs = require('fs');
      tasks = fs.readdirSync('./src/tasks').filter((task) => task.endsWith('.js')),
      Discord = require('discord.js'),
      client = new Discord.Client();

require('./src/internal/database').init();

let numTasks = 0;
    numEnabled = 0,
    listOfTasks = '',
    enabledTasks = '';

for(const _task of tasks) {
    numTasks += 1;
    listOfTasks += _task + ' ';
    let task = require(`./src/tasks/${_task}`);
    if(task.enabled) {
        numEnabled += 1;
        enabledTasks += _task + ' ';
        task.run.start();
    }
}

console.log(`Total tasks [${numTasks}]: ${listOfTasks}\nEnabled tasks [${numEnabled}]: ${enabledTasks}`)
client.login(process.env.token);