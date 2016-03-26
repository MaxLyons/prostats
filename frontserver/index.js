var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var jsgo = require('jsgo');
var dbKey = require('./dbKey.js');
var pg = require('pg');
// var highcharts = require('highcharts');
// var partials = require('express-partials');

var conString = dbKey();




//rendering /index.html at '/' route;
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
//socket on connection
io.on('connection', function(socket){
  socket.emit('idAssign', socket.id);

  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    //querying alias'
    client.query('SELECT alias FROM player_rounds GROUP BY alias', function(err,results){
      if(err) {
        return console.error('Your query is flawed');
      }
      // console.log(results.rows);
      socket.emit('getAlias', results);
    //querying total kills
    client.query('SELECT SUM(kills) AS Kills FROM player_rounds GROUP BY Kills ')
      if(err){
        return console.error('Your query is flawed');
      }
      socket.emit('getKills', results)
    });
  });
});






http.listen(8888, '0.0.0.0', function() {
  console.log('Listening to port:  ' + 8888);
});
