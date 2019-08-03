var path = require('path');
var express = require('express');
var app = express();
var PORT = 1337;
var formidable = require('formidable');
var fs = require('fs');
var winston = require('winston'),
  expressWinston = require('winston-express-middleware');

var database = require('./database');
var bodyParser = require("body-parser");
var Promise = require("bluebird");

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'console.log' })
  ]
});

app.use(bodyParser.json({strict:true, type:'application/json'}));

/* We're behind a proxy...*/
app.enable('trust proxy')

/* Logging */
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/error.log'),
            json: false,
            colorize: false,
            colorStatus: false,
        })
    ]
}));


app.use(expressWinston.logger({
    transports: [
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/access.log'),
            json: false,
            colorize: false,
            colorStatus: false,
        }),

    ],
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting, with the same colors. Enabling this will override any msg and colorStatus if true. Will only output colors on transports with colorize set to true
    colorStatus: false, // Color the status code, using the Express/morgan color palette (default green, 3XX cyan, 4XX yellow, 5XX red). Will not be recognized if expressFormat is true
    ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));

app.use(express.static(path.join(__dirname, '../public')));
app.use('/.well-known', express.static(path.join(__dirname, '../.well-known')));
app.use('/dist', express.static(path.join(__dirname, '../dist')));
app.use('/build', express.static(path.join(__dirname, '../build')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.get('/badges.json', function(req, res){
  Promise.resolve().then(function() {
    return database.getAllBadges();
  })
    .then(function(results) {
      res.send(results);
    })
    .catch(function (err) {
      console.error("got error: " + err);
      if (err instanceof Error) {
        res.status(400).send("General error");
      } else {
        res.status(200).json({ "code": 1000, "message": err });
      }
    });
});

app.post('/update.json', function(req,res) {
  result = database.updateBadge(req,res);
})


app.listen(1337, function () {
  logger.log('info', 'Startup');

  console.log('daBomb 2019: Leaderboard running at http://127.0.0.1:' + PORT + '/');
});
