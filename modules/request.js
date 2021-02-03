const puppeteer = require('puppeteer');
const anime = require('@justalk/anime-api');
const axios = require('axios');
const KICKASSANIME_SEARCH_URL = 'https://www2.kickassanime.rs/api/anime_search';

const headers = {
    "accept": "*/*",
    "accept-language": "ja,en;q=0.9,en-US;q=0.8,fr-CA;q=0.7,fr;q=0.6",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "sec-ch-ua": "\"Google Chrome\";v=\"87\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"87\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest"
}

module.exports = {
    name: 'request',
    fetchWebData: async () => {
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
        
    }
}