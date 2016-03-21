$(function() {
  var id = "";
  var socket = io();
  socket.on('connectedUsers', function(data) {
  });

  socket.on('idAssign', function(data) {
    id = data;
  });

  $(".liveStatTableTabs").on('click',function(){
    var table = $(this)[0].id;
    $("*[data-tableNum=" + table + "]").removeClass('fade').siblings().addClass('fade');
  });

});

