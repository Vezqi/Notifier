import axios from 'axios';
import ITask from '../interfaces/ITask';
import show from '../models/show';
import * as cron from 'node-cron';

const database = require('../internal/database');
const MAL_SCHEDULE = 'https://myanimelist.net/anime/season/schedule';

export default class malCurrentlyAiring implements ITask {
    registered = true;
    run() : any {
        // 30 */5 * * * *
        cron.schedule('/30 * * * * *', async() => {
            // 
        },

        {
            scheduled: false
        }

        ).start();
    }   
}