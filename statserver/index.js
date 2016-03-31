var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var jsgo = require('jsgo');
var pg = require('pg');
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
var dbKey = require('./dbKey.js');
var conString = dbKey();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
    // client.query('CREATE TABLE rounds(id TEXT PRIMARY KEY, game_id TEXT, round_num INTEGER, team_won TEXT, winning_side TEXT, t_score INTEGER, ct_score INTEGER)', function(err, result) {
    //     if(err) {
    //       return console.error('error running query', err);
    //     }
    //     console.log("hey");
    //   });


    // client.query('ALTER TABLE rounds ADD FOREIGN KEY(match_id) REFERENCES matches(id)', function(err, result) {
    //
    //     if(err) {
    //       return console.error('error running query', err);
    //     }
    //     console.log("hey");
    //   });

    // client.query('CREATE TABLE player_rounds(id serial PRIMARY KEY, round_id INTEGER, player_id TEXT, kills INTEGER, deaths INTEGER, assists INTEGER, damage INTEGER)', function(err, result) {
    //
    //     if(err) {
    //       return console.error('error running query', err);
    //     }
    //     console.log("hey");
    //   });

    // client.query('CREATE TABLE teams(id serial PRIMARY KEY, name TEXT, psr INTEGER)', function(err, result) {
    //
    //     if(err) {
    //       return console.error('error running query', err);
    //     }
    //     console.log("hey");
    //   });

    // client.query('CREATE TABLE team_match(id serial PRIMARY KEY, team INTEGER, match INTEGER)', function(err, result) {
    //
    //     if(err) {
    //       return console.error('error running query', err);
    //     }
    //     console.log("hey");
    //   });

    // client.query('ALTER TABLE players ADD FOREIGN KEY(team) REFERENCES teams(id);', function(err, result) {
    //
    //     if(err) {
    //       return console.error('error running query', err);
    //     }
    //     console.log("hey");
    //   });
    // client.query('CREATE TABLE games(match_id TEXT PRIMARY KEY, event TEXT, team1 TEXT, team2 TEXT, team1_score INTEGER, team2_score INTEGER, winner TEXT)', function(err, result) {
    //     if(err) {
    //       return console.error('error running query', err);
    //     }
    //     console.log("hey");
    //   });
    // pg.connect(conString, function(err, client, done) {
    //   if(err) {
    //     return console.error('error fetching client from pool', err);
    //   }
    //   done();
    //   client.query('CREATE TABLE games(match_id TEXT PRIMARY KEY, event TEXT, team1 INTEGER, team2 INTEGER, team1_score INTEGER, team2_score INTEGER, winner TEXT)', function(err, result) {
    //       if(err) {
    //         return console.error('error running query', err);
    //       }
    //       console.log("hey");
    //     });
    // });


    function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    io.on('connection', function(socket){

      socket.on('add team', function(data) {
        pg.connect(conString, function(err, client, done) {
          if(err) {
            return console.error('error fetching client from pool', err);
          }
          done();
          client.query("INSERT INTO teams (name, psr, logo) VALUES ('" + data.name + "', 0, '" + data.logo + "');", function(err, result) {
            if(err) {
              return console.error('error running query', err);
            }
            io.emit('team added', data.name);
            client.query("SELECT * FROM teams", function(err, result) {
              var teamArray = result.rows;
              for (var i = 0; i < teamArray.length; i ++) {
                var team = teamArray[i];
                var teamObject = {id: team.id, name: team.name, logo: team.logo};
                io.emit('populate select', teamObject);
              }
            });
          });
        });
      });

      socket.on('add player', function(data) {
        pg.connect(conString, function(err, client, done) {
          if(err) {
            return console.error('error fetching client from pool', err);
          }
          done();
          client.query("INSERT INTO players (steam_id, team, elo, picture, alias) VALUES ('" + data.steam_id + "', '" + data.team_id + "', 0, '" + data.picture + "', '" + data.name + "');", function(err, result) {
            if(err) {
              return console.error('error running query', err);
            }
            io.emit('player added', data.name);
          });
        });
      });

      pg.connect(conString, function(err, client, done) {
        if(err) {
          return console.error('error fetching client from pool', err);
        }
        client.query("SELECT * FROM teams", function(err, result) {
          var teamArray = result.rows;
          for (var i = 0; i < teamArray.length; i ++) {
            var team = teamArray[i];
            var teamObject = {id: team.id, name: team.name, logo: team.logo};
            io.emit('populate select', teamObject);
          }
        });
        done();
        client.query("SELECT * FROM player_rounds", function(err, result) {
          io.emit('populate players', result.rows);
        });

    });

      socket.on('add game', function(gameData) {
        pg.connect(conString, function(err, client, done) {
          if(err) {
            return console.error('error fetching client from pool', err);
          }
          var gameId = randomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
          var map = "";
          fs.readFile('demo.dem', function(err, data) {
            var gameDone = false;
            var event_name = 'game.round_end';
            var demo = new jsgo.Demo();
                demo.on('server_info', function(event) {
                  map = event.mapName;
                  client.query("INSERT INTO games(match_id, event, team1, team2, map) VALUES ( '" + gameId + "', '" + gameData.title + "', '" + gameData.team1 + "', '" + gameData.team2 + "', '" + map + "');", function(err, result) {
                    if(err) {
                      return console.error('error running query', err);
                    }
                      console.log("Lol");
                  });
                })
                var roundNumber = 1;
                demo.on(event_name, function(event) {
                  var roundId = randomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
                  console.log("-------------");
                  var teams = this.getTeams();
                  for (var i = 0; i < teams.length; i++) {
                    var team = teams[i];
                    var side = team.getSide();
                    var name = team.getClanName();
                    var score = team.getScore();
                    var players = team.getPlayers(this);
                    if (!(name == undefined) && !(name == "") && (side == 'TERRORIST' || side == 'CT')) {
                      for (var x = 0; x < players.length; x++) {
                        var player = players[x];
                        if (!(player == undefined) && !player.isFakePlayer() && !player.isHLTV()) {
                          player.getName();
                          player.getRoundKills();
                          var assists = player.getData().m_iMatchStats_Assists;
                          var damages = player.getData().m_iMatchStats_Damage;
                          var deaths = player.getData().m_iMatchStats_Deaths;
                          var damageArray = [];
                          var deathArray = [];
                          var assistArray = [];
                          for (var damage in damages) {
                            damageArray.push(damages[damage]);
                          }
                          for (var death in deaths) {
                            deathArray.push(deaths[death]);
                          }
                          for (var assist in assists) {
                            assistArray.push(assists[assist]);
                          }
                          var roundDamage = damageArray[damageArray.length - 1];
                          var roundDeath = deathArray[deathArray.length - 1];
                          var roundAssist = assistArray[assistArray.length - 1];
                          var steamId = player.getGuid();
                          steamId = "STEAM_0:" + steamId.substring(8);
                          if (roundAssist == undefined) {
                            roundAssist = 0;
                          }
                          client.query("INSERT INTO player_rounds (round_id, player_id, kills, deaths, assists, damage, alias) VALUES ( '" + roundId + "', '" + steamId + "', '" + player.getRoundKills() + "', '" + roundDeath + "', '" + roundAssist + "', '" + roundDamage + "', '" + player.getName() + "');", function(err, result) {
                            if(err) {
                              return console.error('error running query', err);
                            }
                          });
                        }
                      }
                    }
                  }
                  if (event.player_count == 10 && !(this.getTeams()[2].data.m_szClanTeamname == undefined) && !(this.getTeams()[3].data.m_szClanTeamname == undefined)) {
                    var winningClan = this.getTeams()[event.winner].data.m_szClanTeamname;
                    var winningSide = "";
                    var ctScore = this.getTeams()[3].getScore();
                    var tScore = this.getTeams()[2].getScore();
                    if (event.winner == 2) {
                      winningSide = "Terrorist";
                      tScore += 1;
                    } else if (event.winner == 3) {
                      winningSide = "CT";
                      ctScore += 1;
                    }
                    console.log(winningClan + " Won! They are " + winningSide);
                    console.log("CT score: " + ctScore);
                    console.log("T score: " + tScore);
                    client.query("INSERT INTO rounds(id, game_id, round_num, team_won, winning_side, t_score, ct_score ) VALUES ('" + roundId + "', '" + gameId + "', " + roundNumber + ", '" + winningClan + "', '" + winningSide + "', " + tScore + ", " + ctScore + ");", function(err, result) {
                      if(err) {
                        return console.error('error running query', err);
                      }
                      done();
                    });
                    if (ctScore )
                    roundNumber += 1;
                  }
                });
                demo.parse(data);
              });
        });
        io.emit('game added', gameData.title);
      });
  });

http.listen(3000, function() {
  console.log('Listening to port:  ' + 3000);
});
