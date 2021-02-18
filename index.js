const fs = require('fs');
tasks = fs.readdirSync('./src/tasks').filter((task) => task.endsWith('.js')),
    Discord = require('discord.js'),
    client = new Discord.Client(),
    cron = require('node-cron'),
    request = require('./src/internal/request'),
    database = require('./src/internal/database'),
    utils = require('./src/utils'),
    moment = require('moment'),
    momentTz = require('moment-timezone'),
    got = require('got'),
    config = require('dotenv').config().parsed;

// Need to initialize 'other' table nyaa column with value.
require('./src/internal/database').init();

let numTasks = 0;
numEnabled = 0,
    listOfTasks = '',
    enabledTasks = '';

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
            got: got
        });
    }
}

console.log(`Total tasks [${numTasks}]: ${listOfTasks}\nEnabled tasks [${numEnabled}]: ${enabledTasks}`)
client.login(process.env.token);