$(function() {
  var id = "";
  var socket = io();
  socket.on('connectedUsers', function(data) {
  });
  //
  // socket.on('idAssign', function(data) {
  //   id = data;
  // });
  // listening for frontpgstats;
  socket.on('frontpgstats', function(results){
    // console.log(results);
    for(var i = 0; i < results.length; i++){
      console.log(results[i]);
    }

  })
});
