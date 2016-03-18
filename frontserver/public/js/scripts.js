$(function() {
  var id = "";
  var socket = io();
  socket.on('connectedUsers', function(data) {
  });

  socket.on('idAssign', function(data) {
    id = data;
  });

});
