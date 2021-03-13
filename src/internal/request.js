const puppeteer = require('puppeteer');
      axios = require('axios'),
      parser = require('xml2json'),
      got = require('got'),
      cheerio = require('cheerio');

const liveChartLinkRegex = /\/anime\/([0-9]{0,10})\/(videos|streams)/g;

const request = {
    fetchCurrentlyAiringData: async () => {
        const url = 'https://www2.kickassanime.rs/';
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        let currentlyAiring = [];

        await page.goto(url, {
            waitUntil: 'domcontentloaded'
        });

        await page.waitForSelector('[class^=schedule-list-item]');

        const elements = await page.$$('[class^=schedule-list-section]');

        for (var element of elements) {
            let response = await element.getProperty('innerText');
            let data = response._remoteObject;
            let dayOfWeek = data.value.split('\n')[0];
            let showArr = data.value.split('\n').slice(1);
            for (var i = 0; i < showArr.length - 1; i += 2) {
                let showName = showArr[i];
                let releaseTime = showArr[i + 1];
                currentlyAiring.push({
                    showName: showName,
                    dayOfWeek: dayOfWeek,
                    releaseTime: releaseTime
                });
            }
        }

        await browser.close();
        return currentlyAiring;

    },

    checkNyaaNew: async () => {
        let {
            body
        } = await got('https://nyaa.si/?page=rss');
        let parsed = JSON.parse(parser.toJson(body));
        return parsed.rss.channel.item;

    },

    getRandomDanbooruImage: async() => {
        let req = await got('https://danbooru.donmai.us/posts/random');
        //let req = await got('https://danbooru.donmai.us/posts/4409778');
        let $ = cheerio.load(req.body);
        let postUrl = req.url;

        let info = $('#sidebar'),
            size = info.find('#post-info-size').text().trim().split('\n')[0].split(' .')[0].replace('Size: ', ''),
            favorites = info.find('#post-info-favorites').text().replace('Favorites: ', ''),
            source = info.find('#post-info-source').text().replace('Source: ', '').split('»')[0],
            rating = info.find('#post-info-rating').text().replace('Rating: ', ''),
            score = info.find('#post-info-score').text().replace('Score: ', '').match(/(\d)/)[0];

        let div = $('.image-container').find('.fit-width')[0].attribs,
            img = div.src,
            width = div.width,
            height = div.height,
            id = div.id,
            alt = div.alt;

        let _url = img.split('.'),
            extension = _url[_url.length - 1];

        console.log(postUrl);

        return {
            alt: alt,
            id: id,
            img: img,
            dimensions: {
                width: width,
                height: height
            },
            size: size,
            rating: rating,
            score: score,
            source: source,
            postUrl: postUrl,
            extension: extension,
            favorites: favorites
        }
        
    },

    getLivechartSeason: async() => {

        let { body } = await got('https://www.livechart.me/');
        let $ = cheerio.load(body);

        $('.anime').each((index, element) => {
            let e = $(element);
            let title = e.find('.main-title').text();
            let status = e.find('.anime-date').text();
            let episodeInfo = e.find('.anime-episodes').text();
            let countdown = e.find('.episode-countdown').text();
            let studio = e.find('.anime-studios').text();
            let rating = e.find('.icon-star').text();
            let synposis = e.find('.anime-synopsis').text();
            let image = e.find('.lazy-img')[0].attribs.src;

            // console.log({
            //     title: title,
            //     image: image,
            //     status: status,
            //     episodeInfo: episodeInfo,
            //     countdown: countdown,
            //     studio: studio,
            //     rating: rating,
            //     synposis: synposis.replace('\n', '')
            // });

            /*$(element).find('.related-links').children().each((_, link) => {
                link = link.children[0].attribs.href;
                let parsed = link.replace(liveChartLinkRegex, `https://www.livechart.me/${link}`);
                console.log(`${title} | ${parsed}`);
            });*/
            
        });

    }

}

module.exports = request;