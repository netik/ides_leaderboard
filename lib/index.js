var path = require('path');
var express = require('express');
var app = express();
var PORT = 1337;
var formidable = require('formidable');
var fs = require('fs');
var winston = require('winston'),
    expressWinston = require('winston-express-middleware');

/* Logging */
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        })
    ]
}));


app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console({
            json: false,
            colorize: true
        }), 
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
    colorStatus: true, // Color the status code, using the Express/morgan color palette (default green, 3XX cyan, 4XX yellow, 5XX red). Will not be recognized if expressFormat is true 
    ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response 
}));

app.use(express.static(path.join(__dirname, '../public')));
app.use('/dist', express.static(path.join(__dirname, '../dist')));
app.use('/build', express.static(path.join(__dirname, '../build')));

app.post('/upload', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // one file please.
  form.multiples = false;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '../uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
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
  form.parse(req);

});

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.get('/leaderboard', function(req, res){
  res.sendFile(path.join(__dirname, '../views/leaderboard.html'));
});

app.listen(1337, function () {
  console.log('Ides of Defcon Leaderboard and file upload service, running on port ' + PORT)
})

console.log('Server running at http://127.0.0.1:' + PORT + '/');
