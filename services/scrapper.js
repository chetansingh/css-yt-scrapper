const puppeteer = require("puppeteer");
const appConfig = require('../config');
const scrappingInfo = appConfig.scrappingInfo;

const mongo = {
    db: null
};

const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const run = (semanticURL) => (
    new Promise(async (resolve, reject) => {
        try {
            let results = {};
            const pageURL = scrappingInfo.youTube.baseUrl.URL + semanticURL
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            await page.setViewport({ width: 1280, height: 800 });
            await page.setRequestInterception(true);

            page.on('request', (request) => {
                if (request.resourceType() === 'document') {
                    request.continue();
                } else {
                    request.abort();
                }
            });

            await page.goto(pageURL, { waitUntil: 'networkidle0' });

            try {
                await page.waitForSelector('input[id="search"]', { timeout: 5000 });
                await page.content();
            } catch (e) {
                return results;
            }

            const ytInitialData = await page.evaluate(() => {
                return window.ytInitialData;
            });

            const allChannelPagesData = parseVideoContent(ytInitialData).map(async (data, i) => {
                const pageURL = scrappingInfo.youTube.baseUrl.URL + data.video.url;
                try {
                    const browser = await puppeteer.launch();
                    const page = await browser.newPage();
                    await page.setViewport({ width: 1280, height: 800 });
                    await page.setRequestInterception(true);
                    page.on('request', (request) => {
                        if (request.resourceType() === 'document') {
                            request.continue();
                        } else {
                            request.abort();
                        }
                    });
                    console.log(`loading page: ${pageURL}`);
                    console.log("Sleep to avoid blocking from youtube");
                    //TODO : Use proxy server instead of sleep to avoid blocking
                    await sleep(5000);
                    console.warn("Use proxy server instead of sleep");
                    await page.goto(pageURL, {
                        waitUntil: 'load',
                        timeout: 120000,
                    });

                    await page.content();

                    const ytInitialData = await page.evaluate(() => {
                        return window.ytInitialData;
                    });

                    data.additionalData = ytInitialData;
                    await page.close();
                } catch (e) {
                    return reject(e);
                }
                browser.close();
                return data;
            });

            Promise.all(allChannelPagesData).then((obj) => {
                resolve(obj)
                browser.close();
            }).catch((e) => {
                console.log(e);
            });
        } catch (e) {
            return reject(e);
        }
    })
);

const parseVideoChannelData = (allData) => {

    var responseData = [];

    allData.forEach((obj) => {
        let tempObject = JSON.parse(JSON.stringify(obj));
        let additionalContent = obj.additionalData && obj.additionalData.contents || null;
        let videoInfo = additionalContent && additionalContent.twoColumnWatchNextResults.results.results.contents[0].videoPrimaryInfoRenderer || null;
        let channelInfo = additionalContent && additionalContent.twoColumnWatchNextResults.results.results.contents[1].videoSecondaryInfoRenderer || null;
        let topLevelButtons = videoInfo && videoInfo.videoActions && videoInfo.videoActions.menuRenderer.topLevelButtons || null;

        if (topLevelButtons) {
            topLevelButtons.forEach((data) => {
                let action = data && data.toggleButtonRenderer || null;
                if (action) {
                    switch (action.targetId) {
                        case "watch-dislike":
                            tempObject.video.dislikes.viewCountText = action.toggledText.accessibility && action.toggledText.accessibility.accessibilityData && action.toggledText.accessibility.accessibilityData.label || null;
                            tempObject.video.dislikes.shortViewCountText = action.toggledText.simpleText;
                            break;
                        case "watch-like":
                            tempObject.video.likes.viewCountText = action.toggledText.accessibility && action.toggledText.accessibility.accessibilityData && action.toggledText.accessibility.accessibilityData.label || null;
                            tempObject.video.likes.shortViewCountText = action.toggledText.simpleText;
                            break;
                    }
                }
            });
        }

        tempObject.channel.title.text = channelInfo && channelInfo.owner.videoOwnerRenderer.title.runs[0].text;
        tempObject.channel.thumbnails = channelInfo && channelInfo.owner.videoOwnerRenderer.thumbnail.thumbnails;
        tempObject.channel.description = channelInfo && channelInfo.description && channelInfo.description.runs;
        tempObject.channel.subscribers.shortViewCountText = channelInfo && channelInfo.owner.videoOwnerRenderer.subscriberCountText && channelInfo.owner.videoOwnerRenderer.subscriberCountText.runs[0].text;
        delete tempObject.additionalData;

        mongo.db.collection('videos').update({id:tempObject.id},{$set: tempObject},{ upsert: true})
            .then(result => {
                console.log(result);
            })
            .catch(error => console.error(error))

        responseData.push(tempObject);
    });

    return responseData;
};

const parseVideoContent = (jsonData) => {
    let data = jsonData.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents;
    let videoList = [];
    
    data.forEach((content) => {
        let containerData = content.itemSectionRenderer.contents[0].shelfRenderer.content;
        //filtering only expandedShelfContentsRenderer contents of youtube
        if (containerData.hasOwnProperty('expandedShelfContentsRenderer')) {
            let items = containerData.expandedShelfContentsRenderer.items;
            items.forEach((item) => {
                let itemData = item.videoRenderer;
                let obj = JSON.parse(JSON.stringify(scrappingInfo.youTube.trending.data));
                obj.id = itemData.videoId;
                obj.video.title.text = itemData.title.runs[0].text;
                obj.video.title.label = itemData.title.accessibility.accessibilityData.label;
                obj.video.description = itemData.descriptionSnippet && itemData.descriptionSnippet.runs[0].text;
                obj.video.url = itemData.navigationEndpoint.commandMetadata.webCommandMetadata.url;
                obj.video.thumbnails = itemData.thumbnail.thumbnails;
                obj.video.views.viewCountText = itemData.viewCountText.simpleText;
                obj.video.views.shortViewCountText = itemData.shortViewCountText.simpleText;
                videoList.push(obj);
            });
        }
    });

    return videoList;
};

const scrapper = (req, res) => (callback, youtubeResponseJSON = false) => {
    run(scrappingInfo.youTube.trending.URL, null).then(function (json) {
        if (!youtubeResponseJSON) {
            console.log(json);
            json = parseVideoChannelData(json);
        }
        callback(json, res);
    }).catch(console.error);
}

module.exports = {
    mongo,
    scrapper
};

