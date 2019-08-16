let express = require('express');

let bodyParser = require('body-parser');

let app = express();

let db = require('./database')

require('dotenv').config()

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

// Setup server port
var port = process.env.PORT || 3000;

var basepath = '/api';

db.connect(process.env.DB_HOST, process.env.DB_NAME, function (err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    console.log('Successfully Connected To Database')
  }
})

// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Admin_API_Nodejs'));
// Use Api routes in the App

let routes = require('./app/routes/routes');

app.use(basepath, routes);

// Launch app to listen to specified port
var server = app.listen(port, function () {
  console.log("Running Zon on port " + port);
});

module.exports = server;