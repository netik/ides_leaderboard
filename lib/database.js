// mysql.js
// First you need to create a connection to the db
var mysql = require("mysql");

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "ides",
  password: "d6222b23e9f7ee0c253",
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
