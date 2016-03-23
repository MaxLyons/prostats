}var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var jsgo = require('jsgo');
var pg = require('pg');
var conString = "";
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.post('/', function(req, res) {
    console.log(req.body);
});
pg.connect(conString, function(err, client, done) {

    if(err) {
      return console.error('error fetching client from pool', err);
    }
    done();
    // client.query('CREATE TABLE rounds(id serial PRIMARY KEY, match_id int, round_num INTEGER, team_won TEXT)', function(err, result) {
    //
    //     if(err) {
    //       return console.error('error running query', err);
    //     }
    //     console.log("hey");
    //   });

    // client.query('CREATE TABLE matches(id serial PRIMARY KEY, match_date timestamp without time zone, event text, winner TEXT)', function(err, result) {
    //
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

    // client.query('CREATE TABLE player_rounds(id serial PRIMARY KEY, round_id INTEGER, player_id INTEGER, kills INTEGER, deaths INTEGER, assists INTEGER, damage INTEGER)', function(err, result) {
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

    client.query('ALTER TABLE team_match ADD FOREIGN KEY(team) REFERENCES teams(name);', function(err, result) {

        if(err) {
          return console.error('error running query', err);
        }
        console.log("hey");
      });


});
// var rounds = [];
// fs.readFile('demo.dem', function(err, data) {
//   var demo = new jsgo.Demo();
//   // new jsgo.Demo().on('server_info', function(event) {
//   //   var map = event.mapName;
//   // }).parse(data);
//
//   function spew(event_name){
//     var roundNumber = 1;
//     demo.on(event_name, function(event) {
//       var teamArray = [];
//       var playerArray = [];
//       console.log("------------\nEvent:  " + event_name);
//       var teams = this.getTeams();
//       for (var i = 0; i < teams.length; i++) {
//         var team = teams[i];
//         var side = team.getSide();
//         var name = team.getClanName();
//         var score = team.getScore();
//
//         var players = team.getPlayers(this);
//         if (side == 'TERRORIST' || side == 'CT') {
//           for (var x = 0; x < players.length; x++) {
//             var player = players[x];
//             if (!player.isFakePlayer() && !player.isHLTV()) {
//               var killsArray = player.getData().m_iMatchStats_Kills;
//               var assistsArray = player.getData().m_iMatchStats_Assists;
//               var deathsArray = player.getData().m_iMatchStats_Deaths;
//               var damagesArray = player.getData().m_iMatchStats_Damage;
//               var kills = 0;
//               var assists = 0;
//               var deaths = 0;
//               var damages = 0;
//               for (var kill in killsArray) {
//                 kills += killsArray[kill];
//               }
//               for (var assist in assistsArray) {
//                 assists += assistsArray[assist];
//               }
//               for (var death in deathsArray) {
//                 deaths += deathsArray[death];
//               }
//               for (var damage in damagesArray) {
//                 damages = damagesArray[damage];
//               }
//               var playerObject = {name: player.getName(), guid: player.getGuid(), kills: kills, deaths: deaths, assists: assists, roundKills: player.getRoundKills(), damage: damages};
//               playerArray.push(playerObject);
//             }
//           }
//           var won = false;
//           if (event.winner == 2 && side == 'TERRORIST') {
//             score += 1;
//             won = true;
//           } else if (event.winner == 3 && side == 'CT') {
//             score += 1;
//             won = true;
//           }
//           var teamObject = {name: name, side: side, score: score, won: won};
//           teamArray.push(teamObject);
//         }
//       }
//       var roundObject = {round: roundNumber, teams: teamArray, players: playerArray};
//       rounds.push(roundObject);
//       roundNumber += 1;
//       console.log(teamArray);
//     });
//   }
//   spew('game.round_end');
//
//   demo.parse(data);
//   // console.log(rounds);
// });

// io.on('connection', function(socket){
//   socket.emit('idAssign', socket.id);

  // socket.on('move', function(data) {
  //   io.emit('move', data);
  // });

  // socket.on('disconnect', function() {
  //   var client = allClients.indexOf(socket);
  //   allClients.splice(allClients.indexOf(socket), 1);
  //   activeUsers.splice(client , 1);
  //   io.emit('connectedUsers', io.engine.clientsCount);
  //   io.emit('online', activeUsers);
  // });


// });
http.listen(3000, function() {
  console.log('Listening to port:  ' + 3000);
});
