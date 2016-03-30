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
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query("SELECT count(*) AS exact_count FROM games",
    function(err,results){
      if(err) {
        return console.error('error occurred');
      }
      socket.emit('game count', results.rows[0].exact_count);
    });
    client.query("SELECT count(*) AS exact_count FROM teams",
    function(err,results){
      if(err) {
        return console.error('error occurred');
      }
      socket.emit('team count', results.rows[0].exact_count);
    });
    client.query("SELECT count(*) AS exact_count FROM players",
    function(err,results){
      if(err) {
        return console.error('error occurred');
      }
      socket.emit('player count', results.rows[0].exact_count);
    });
    client.query("SELECT picture FROM players WHERE alias = 'n0thing'",
    function(err,results){
      if(err) {
        return console.error('error occurred');
      }
      socket.emit('n0thing', results.rows[0].picture);
    });

    //Felix's queries

    //events
    client.query("SELECT g.match_id, g.map AS map, g.event, t1.name AS t1name, t1.id AS t1id, t2.name AS t2name, t2.id AS t2id\
    FROM games AS g \
    JOIN teams AS t1 ON g.team1 = t1.id\
    JOIN teams AS t2 ON g.team2 = t2.id",

    function(err, results){
      if(err){
        console.error("Your query is flawed");

      }
      console.log(results);
      socket.emit('getEvents', results);
    });

    // querying team order by last rounds in rounds table
    client.query("select r1.* from rounds as r1\
    left join rounds as r2 ON (r1.game_id = r2.game_id and r1.round_num < r2.round_num) \
    WHERE r2.id IS NULL;",

    function(err, results){
      if(err){
        console.log('Your query is flawed')
      }
      console.log(results);
      socket.emit('team_side', results);
    })

    //kda for all games played/ all 10 players per game
    var uniqueGame_id = "(";
    client.query("SELECT games.match_id FROM games",

    function(err, results){
      if(err){
        console.error("Your query is flawed");
      }

      results.rows.map(function(num){
        uniqueGame_id += "'" + num.match_id + "',";
      });
      uniqueGame_id = uniqueGame_id.slice(0,-1) + ")";

      client.query(
        "SELECT rounds.game_id, teams.name AS team, players.alias, SUM(kills) AS kills, SUM(deaths) AS deaths, SUM(assists) AS assists, SUM(player_rounds.damage) AS TotalTeamDamage FROM rounds \
        JOIN player_rounds ON rounds.id=player_rounds.round_id \
        JOIN players ON player_rounds.player_id=players.steam_id \
        JOIN teams ON players.team=teams.id \
        WHERE rounds.game_id IN" + uniqueGame_id +"\
        GROUP BY players.alias, teams.name, rounds.game_id\
        ORDER BY teams.name",
        function(err,results){
          if(err) {
            return console.error('error occurred');
          }
          // console.log(results);
          socket.emit('getKDAmatches', results)
        });

      });
    });


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
