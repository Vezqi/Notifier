const puppeteer = require('puppeteer');
axios = require('axios'),
    parser = require('xml2json'),
    got = require('got');

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
        let { body } = await got('https://nyaa.si/?page=rss');
        let parsed = JSON.parse(parser.toJson(body));
        return parsed.rss.channel.item;

    }
}

module.exports = request;