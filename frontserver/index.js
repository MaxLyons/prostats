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

var conString = dbKey();

//rendering /index.html at '/' route;
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
//socket on connection
io.on('connection', function(socket){
  socket.emit('idAssign', socket.id);

/* ??????
    client.query('SELECT p.alias, pr.kills, pr.assists, pr.deaths, pr.damage  FROM players AS p INNER JOIN player_rounds AS pr ON pr.player_id = p.steam_id ', function(err,results){
    socket.emit('getAlias', results);
    client.query('SELECT games.event, games.team1, games.team2, rounds.team_won FROM games INNER JOIN rounds ON games.match_id = rounds.game_id', function(err, results){
      if(err){
        return console.error('Your query is flawed');
      }
      console.log(results)
      socket.emit('getAlias', results);
*/

  //returns Win Loss to stat table
  socket.on('getWinLossData', function(player){
    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(
        "SELECT rounds.team_won, \
        rounds.winning_side, \
        player_rounds.kills \
        FROM player_rounds \
        JOIN rounds ON player_rounds.round_id=rounds.id \
        WHERE player_rounds.alias LIKE'%"+player+"%'",
        function(err,results){
        if(err) {
          return console.error('error occurred');
        }
        socket.emit('printWinLoss', results);
      });
      client.query(
        "SELECT rounds.team_won, \
        rounds.winning_side, \
        player_rounds.kills \
        FROM player_rounds \
        JOIN rounds ON player_rounds.round_id=rounds.id",
        function(err,results){
        if(err) {
          return console.error('error occurred');
        }
        socket.emit('printWinLossALL', results);
      });
    });
  });

  //return kill Participations
  socket.on('getKillPart', function(player){
    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(
        "SELECT DISTINCT games.match_id, players.team FROM player_rounds \
        JOIN rounds ON player_rounds.round_id=rounds.id \
        JOIN games ON rounds.game_id=games.match_id \
        JOIN players ON player_rounds.player_id=players.steam_id \
        WHERE player_rounds.alias LIKE'%"+player+"%'",
        function(err,results){
        if(err) {
          return console.error('error occurred');
        }
        var teamNum = results.rows[0].team;
        var str = "(";
        results.rows.map(function(num){
          str += "'" + num.match_id + "',";
        }); 
        str = str.slice(0,-1) + ")";
        client.query(
          "SELECT players.team, SUM(player_rounds.kills) AS sum_team_kills FROM rounds \
          JOIN player_rounds ON rounds.id=player_rounds.round_id \
          JOIN players ON player_rounds.player_id=players.steam_id \
          WHERE game_id IN " + str + " AND players.team = '" + teamNum + "' \
          GROUP BY players.team",
          function(err,results){
          if(err) {
            return console.error('error occurred');
          }
          socket.emit('printKillPart', results);
        });
      });
    });
  });

  //return kill Participations for ALL players stat table
  socket.on('getKillPartALL', function(player){
    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(
        "select p1.steam_id, pr1.round_id, pr1.kills as my_kills, sum(pr2.kills) as our_kills\
        from players p1\
        join players p2 on p2.team = p1.team\
        join player_rounds pr1 on pr1.player_id = p1.steam_id\
        join player_rounds pr2 on pr2.player_id = p2.steam_id\
        where pr1.round_id = pr2.round_id\
        group by p1.steam_id, pr1.round_id, pr1.kills\
        order by p1.steam_id, pr1.round_id",
      function(err,results){
      if(err) {
        return console.error('error occurred');
      }
      socket.emit('printKillPartALL', results);
      });
    });
  });

//returns KDA to stat table
  socket.on('getKDA', function(player){
    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(
        "SELECT SUM(player_rounds.kills) AS sum_kills,\
        SUM(player_rounds.kills)*100/(COUNT(*)+1) AS avg_kills, \
        SUM(player_rounds.deaths)*100/(COUNT(*)+1) AS avg_deaths, \
        SUM(player_rounds.assists)*100/(COUNT(*)+1) AS avg_assists, \
        SUM(player_rounds.damage)/(COUNT(*)+1) AS avg_damage \
        FROM player_rounds \
        JOIN players ON player_rounds.player_id=players.steam_id \
        JOIN teams ON players.team=teams.id \
        JOIN rounds ON player_rounds.round_id=rounds.id \
        WHERE player_rounds.alias LIKE'%"+player+"%'",
        function(err,results){
        if(err) {
          return console.error('error occurred');
        }
        results.rows[0].playerName = player;
        socket.emit('printKDA', results);
      });
      client.query(
        "SELECT SUM(player_rounds.kills) AS sum_kills,\
        SUM(player_rounds.kills)*100/(COUNT(*)+1) AS avg_kills, \
        SUM(player_rounds.deaths)*100/(COUNT(*)+1) AS avg_deaths, \
        SUM(player_rounds.assists)*100/(COUNT(*)+1) AS avg_assists, \
        SUM(player_rounds.damage)/(COUNT(*)+1) AS avg_damage \
        FROM player_rounds \
        JOIN players ON player_rounds.player_id=players.steam_id \
        JOIN teams ON players.team=teams.id \
        JOIN rounds ON player_rounds.round_id=rounds.id",
        function(err,results){
        if(err) {
          return console.error('error occurred');
        }
        results.rows[0].playerName = player;
        socket.emit('printKDAALL', results);
      });
    });
  });


  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM players JOIN teams ON players.team = teams.id LIMIT 1', function(err,results){
        if(err) {
          return console.error('error occurred');
        }
        socket.emit('statData', results);
    });
  });
});

http.listen(8888, '0.0.0.0', function() {
  console.log('Listening to port:  ' + 8888);
});
