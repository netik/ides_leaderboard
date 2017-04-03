var express = require('express');
var app = express();
var PORT = 1337;

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(1337, function () {
  console.log('Ides of Defcon Leaderboard, running on port ' + PORT)
})

console.log('Server running at http://127.0.0.1:' + PORT + '/');
