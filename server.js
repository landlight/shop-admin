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

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
  }));
  
app.use(bodyParser.json());
app.get('/healthcheck', (req, res) => res.json({message: 'success'}));
app.get('/', function(req, res){
    res.send('Hello Express');
});
var itemRouter = require('./app/routes/itemRoutes');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/items', itemRouter);

// Setup server port
var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
    console.log("Running Shop-Admin on port " + port);
});
  
module.exports = server;