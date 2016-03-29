var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var jsgo = require('jsgo');
var dbKey = require('./dbKey.js');
var pg = require('pg');
var fs = require('fs');
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


    // client.query('SELECT * FROM games LIMIT 1', function(err,results){
    //   if(err) {
    //     return console.error('Your query is flawed');
    //   }
    //   console.log(results);
    //   // socket.emit('frontpgstats', results);
    //   });
    // });
    //
    // //PULLING DATA FOR STATISTIC PAGE
    // pg.connect(conString, function(err, client, done) {
    //   if(err) {
    //     return console.error('error fetching client from pool', err);
    //   }
    //   client.query('SELECT * FROM players JOIN teams ON players.team = teams.id LIMIT 1', function(err,results){
    //     if(err) {
    //       return console.error('error occurred');
    //     }
    //     // console.log(results);
    //     socket.emit('statData', results);
    //   });

    //querying player_rounds
    // client.query('SELECT * FROM player_rounds', function(err,results){
    //   if(err) {
    //     return console.error('Your query is flawed');
    //   }
    //   console.log('done');
    //   console.log(results);
    //   socket.emit('getAlias', results);
    //
    //
    // });
    //
    //querying from players
    // client.query('SELECT * FROM players', function(err,results){
    //   if(err) {
    //     return console.error('Your query is flawed');
    //   }
    //   console.log('done');
    //   console.log(results);
    //   socket.emit('getAlias', results);
    //
    //
    // });
    //
    //querying from teams
    // client.query('SELECT * FROM teams', function(err,results){
    //   if(err) {
    //     return console.error('Your query is flawed');
    //   }
    //   console.log('done');
    //   console.log(results);
    //   socket.emit('getAlias', results);
    //
    //
    // });
    //
    // querying from rounds
    // client.query('SELECT * FROM rounds', function(err,results){
    //   if(err) {
    //     return console.error('Your query is flawed');
    //   }
    //   console.log('done');
    //   console.log(results);
    //   socket.emit('getAlias', results);
    // });
    //
    //
    // INNER JOIN games as g ON g.match_id= r.game_id
    //querying from games
    client.query('SELECT p.alias, pr.kills, pr.assists, pr.deaths, pr.damage  FROM players AS p INNER JOIN player_rounds AS pr ON pr.player_id = p.steam_id ', function(err,results){


      if(err) {
        return console.error('Your query is flawed');
      }
      // console.log('done');
      console.log(results);
      socket.emit('getAlias', results);
    });

    client.query('SELECT games.event, games.team1, games.team2, rounds.team_won FROM games INNER JOIN rounds ON games.match_id = rounds.game_id', function(err, results){
      if(err){
        return console.error('Your query is flawed');
      }
      console.log(results)
      socket.emit('getAlias', results);

    });



  });


});







http.listen(8888, '0.0.0.0', function() {
  console.log('Listening to port:  ' + 8888);
});
