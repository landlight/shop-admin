let express = require('express');

let bodyParser = require('body-parser');

let app = express();

let mongoose = require('mongoose');

//Set up default mongoose connection
let mongoDB = 'mongodb://127.0.0.1/shop_admin';

mongoose.connect(mongoDB, { useNewUrlParser: true });

require('dotenv').config()

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Configure bodyparser to handle post requests
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(bodyParser.json());
app.get('/healthcheck', (req, res) => res.json({message: 'success'}));
app.get('/', function(req, res){
    res.json({message: 'success'});
});

let routes = require('./app/routes/routes');
let basepath = '/api/'

app.get('/', (req, res) => res.json('Hello World with Shop API'));

app.use(basepath, routes);

// Setup server port
var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
    console.log("Running Shop-Admin on port " + port);
});
  
module.exports = server;