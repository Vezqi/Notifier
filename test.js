const database = require('./src/internal/database');
const utils = require('./src/utils');

let t = utils.getCurrentTimeFormatted();

(async() => {
    console.log('Checking for new shows...');
    let g = await database.checkForNewEpisodes();

    console.log(g);
    console.log(t);

})();