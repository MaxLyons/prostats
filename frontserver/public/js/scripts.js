$(function() {
  var id = "";
  var socket = io();
  socket.on('connectedUsers', function(data) {
  });

  socket.on('idAssign', function(data) {
    id = data;
  });

  function addData (stat){
    console.log("I AM READING THE DATA");
  };

  socket.on('tableResults', function(results){
    console.log(results);
  });



  $(".liveStatTableTabs").on('click',function(){
    var table = $(this)[0].id;
    $("*[data-tableNum=" + table + "]").removeClass('fade').siblings().addClass('fade');

    socket.emit('wantTable', table);

    socket.on('getTable', function(stat){
      console.log('addData');
      addData(stat);
    });

  });

});

