const cron = require('node-cron');
const fs = require('fs');
const request = require('./modules/request'),
      database = require('./modules/database');

const utils = require('./utils');
const Discord = require('discord.js'),
      client = new Discord.Client();

require('dotenv').config()

client.on('ready', () => console.log('Connected to Discord!'));

// Refresh our local data every 5 minutes and 30 seconds:

cron.schedule('30 */5 * * * *', async () => {
    try {
        console.log('Running refresh task...');
        let data = await request.fetchWebData();
        await database.refresh(data);
        console.log('Refresh task completed successfully.');
    } catch (e) {
        console.error(`Refresh task failed: ${e}`);
    }
});

// Check our database every minute to see if a new show has released: 

cron.schedule('*/30 * * * * *', async () => {

    let shows = await database.checkNew();
    for (var show of shows) {
        console.log(`A new episode of ${show.name} has released!`);
        await client.channels.cache.get(process.env.notificationChannel).send(`A new episode of ${show.name} has released!`);
    }

});

client.login(process.env.token);