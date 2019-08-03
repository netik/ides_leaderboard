# Ides of DEF CON: Leaderboard

This is the server for the leaderboard of the Ides of DEF CON game.

The (client.js) monitors BLE and looks for new connections.

When the code a GATT advertisment from our vendor id and badge, thee
data is read, and then forwarded via HTTPS POST to this code, which
will store it into the database.

The leaderboard page makes XHR requests, and when the page next polls,
it will display data from all seen badges.


# Database:

docker run -p 3306:3306 -d --name mysql -e MYSQL_ROOT_PASSWORD=password mysql/mysql-server

# Set it up. Edit lib/database.js, then build mysql to match:

# we're gonna rely on you to keep your mysql server security
# straight. these rules open up access to any ip, but you are running
# behind docker, so you should be safe.

docker exec -it mysql bash

Then type:
   mysql -p

   <login with the password>
   create database dc29;
   create user 'lb'@'%' IDENTIFIED WITH mysql_native_password BY 'd6222b23e9f7ee0c253';

   GRANT ALL PRIVILEGES ON dc29.* TO 'lb'@'%';
   quit

