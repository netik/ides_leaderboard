// mysql.js
// First you need to create a connection to the db
var mysql = require("mysql");
var Promise = require("bluebird");

Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var pool = mysql.createPool({
  host: "127.0.0.1",
  user: "lb",
  password: "d6222b23e9f7ee0c253",
  database: "dc29"
});

function getSqlConnection() {
  return pool.getConnectionAsync().disposer(function (connection) {
    connection.release();
  });
}

function querySql (query, params) {
  return Promise.using(getSqlConnection(), function (connection) {
    if (typeof params !== 'undefined'){
      return connection.queryAsync(query, params);
    } else {
      return connection.queryAsync(query);
    }
  });
};

exports.getAllBadges = function() {
  return querySql('select * from badges order by won desc');
};


function retrieveBadge(badgeid) {
  var userQuery = "select * from badges where badgeid = ?";
  return querySql(userQuery, [badgeid]);
}

function updateBadgeStats(rows, newdata) {
  if (rows.length == 0) {
    var userInsert = 'INSERT INTO badges (created_at, badgeid, name, xp, level) VALUES ( now(), ?, ?, ?, ?)';
    return querySql(userInsert, 
                    [ newdata.badgeid, newdata.name, newdata.xp, newdata.level ]);
  } else {
    var user = rows[0];
    var userUpdate = 'UPDATE badges SET updated_at=now(), name=?, xp=?, level=? WHERE id=?;';
    
    return querySql(userUpdate, 
                    [ newdata.name, newdata.xp, newdata.level, user.id ]);
  }
}

exports.updateBadge = function(req, res) {
  
  // authenticate
  if (req.body.apikey != 'ddsUffXZuAu2URNyxKefyNcsUjeasJ') {
    res.status(200).json({"message": "forbidden"});
    return;
  }
  
  // can be async. don't care
  querySql('INSERT INTO badge_history (created_at, badgeid, name, xp, level) VALUES ( now(), ?,?,?,? )',
            [ req.body.badgeid, req.body.name, req.body.xp, req.body.level ]);

  // chained promises
  Promise.resolve().then(function() {
    return retrieveBadge(req.body.badgeid);
  })
    .then(function (rows) {
      return updateBadgeStats(rows, req.body);
    })
    .then(function (user){
      res.status(200).json({"message": "success"});
    })
    .catch(function (err) {
      console.error("got error: " + err);
      if (err instanceof Error) {
        res.status(500).json({ "message" : "General error"});
      } else {
        res.status(200).json({ "message": err });
      }
    });
};
