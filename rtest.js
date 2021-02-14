const axios = require('axios');

(async() => {
    const r = await axios.get('https://nyaa.si/?page=rss');
    console.log(r);
})();