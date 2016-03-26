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

// pg.connect(conString, function(err, client, done) {
//   if(err) {
//     return console.error('error fetching client from pool', err);
//   }
//   client.query('SELECT * FROM games LIMIT 10', function(err,results){
//     if(err) {
//       return console.error('error occurred');
//     }
//     console.log(results);
//     return results;
//   });
// });


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

    client.query('SELECT * FROM games LIMIT 1', function(err,results){
      if(err) {
        return console.error('Your query is flawed');
      }
      console.log(results);
      // socket.emit('frontpgstats', results);
      });
    });

    //PULLING DATA FOR STATISTIC PAGE
    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query('SELECT * FROM players JOIN teams ON players.team = teams.id LIMIT 1', function(err,results){
        if(err) {
          return console.error('error occurred');
        }
        // console.log(results);
        socket.emit('statData', results);
      });
    });
  });






http.listen(8888, '0.0.0.0', function() {
  console.log('Listening to port:  ' + 8888);
});
