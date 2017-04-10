// mysql.js
// First you need to create a connection to the db
var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "nUwMjMydY)ChzDJRt&R7hMrN",
  database: "dc25"
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});


exports.getAllBadges = function(cb) {
  con.query('select * from badges order by won desc', function (err, rows, fields) {
    // close connection first
    // done: call callback with results
    cb(err, rows);
  });
};
