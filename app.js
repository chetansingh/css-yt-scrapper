const express = require("express");
const bodyParser = require('body-parser');
const apisController = require('./apis');
const appConfig = require('./config');
const MongoClient = require('mongodb').MongoClient;
const mongoConfig = appConfig.mongo;

const PORT = process.env.PORT || 3401;
const app = express();

// Configure middleware
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// enable apis
const router = express.Router();
const rootRouter = express.Router();

rootRouter.get('/', (req, res) => {
  console.log(`Youtube Scrapper Server is up on ${PORT} port ...!`);
  res.json({ message: `Youtube Scrapper Server is up on ${PORT} !` });
});

//connecting mongodb
MongoClient.connect(process.env.DB_HOST || mongoConfig.url, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db(mongoConfig.db);
    
    // mounting apis
    apisController(router,db);
    app.use('/scrapper/v1/', router);
    app.use('/', rootRouter);

  })

// Start the server
app.listen(PORT, function () {
  console.log("App listening on port " + PORT);
});
