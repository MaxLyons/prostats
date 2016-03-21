var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var jsgo = require('jsgo');
var dbKey = require('./dbKey.js');
var pg = require('pg');

var conString = dbKey();

pg.connect(conString, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('SELECT * FROM fire LIMIT 1', function(err,results){
    if(err) {
      return console.error('error occurred');
    }
    console.log(results);
  })
});

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.emit('idAssign', socket.id);

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


});

http.listen(8888, '0.0.0.0', function() {
  console.log('Listening to port:  ' + 8888);
});
