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

app.use('/itbegins', express.static(path.join(__dirname, '../itbegins')));

app.post('/upload', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();
  var username = '';
  
  // one file please.
  form.multiples = false;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '../uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
    // append the user's name to the log
    fs.appendFile(path.join(__dirname, '../uploads/uploadlog.csv') , file.name, function(err) {
      if (err) return console.log(err);
    });
    

  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req, function(err, fields, files) {
    fs.appendFile(path.join(__dirname, '../uploads/uploadlog.csv') , '|' + fields['name'] + '\n',  function(err) {
      if (err) return console.log(err);
    });
  });
  
});

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.get('/upload', function(req, res){
  res.sendFile(path.join(__dirname, '../views/upload.html'));
});

app.get('/leaderboard', function(req, res){
  res.sendFile(path.join(__dirname, '../views/leaderboard.html'));
});

app.get('/faq', function(req, res){
  res.sendFile(path.join(__dirname, '../views/faq.html'));
});

app.get('/screens', function(req, res){
  res.sendFile(path.join(__dirname, '../views/screens.html'));
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
  console.log('Ides of Defcon Leaderboard and file upload service, running on port ' + PORT)
})

console.log('Server running at http://127.0.0.1:' + PORT + '/');
