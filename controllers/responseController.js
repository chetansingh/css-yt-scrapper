const appConfig = require('../config');
const responseData = appConfig.responseType;

const returnScrappedData = function (data, res) {
    responseData.success.data = data;
    res.status(200).send(responseData.success);
}

module.exports = {
    returnScrappedData
};