var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

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


});

http.listen(3000, '0.0.0.0', function() {
  console.log('Listening to port:  ' + 3000);
});
