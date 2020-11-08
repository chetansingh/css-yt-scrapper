const { scrapper, mongo } = require('./services/scrapper');
const { returnScrappedData } = require('./controllers/responseController');


const apiController = function (router, db) {

    router.get('/save/trending', (req, res) => {
        mongo.db = db;
        scrapper(req, res)(returnScrappedData);
    });

    router.get('/fetch/trending/video', (req, res) => {
        db.collection('videos').find({}, { projection: { _id: 0, channel: 0 } }).toArray()
            .then(results => {
                returnScrappedData(results, res)
            })
            .catch(error => console.error(error))
    });

    router.get('/fetch/trending/channel/video', (req, res) => {
        db.collection('videos').find({}, { projection: { _id: 0 } }).toArray()
            .then(results => {
                returnScrappedData(results, res)
            })
            .catch(error => console.error(error))
    });


    router.get('/fetch/trending/videoInfo/:videoId', (req, res) => {
        let videoId = req.params.videoId;
        db.collection('videos').findOne({ id: { $eq: videoId } }, { projection: { _id: 0 } })
            .then(result => {
                let data = [];
                data.push(result);
                returnScrappedData(data, res);
            })
            .catch(error => console.error(error))
    });

};

module.exports = apiController;