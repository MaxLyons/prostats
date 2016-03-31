$(function() {
  var socket = io();
  // socket.on('connectedUsers', function(data) {
  // });

  //
  $('#team').submit(function(){
    var team = {name: $('#team_name').val(), logo: $('#logo_url').val()}
    socket.emit('add team', team);
    $('#team_name').val('');
    $('#logo_url').val('');
    return false;
  });

  $('#player').submit(function(){
    var player = {team_id: $('#team_list').val(), name: $('#player_name').val(), steam_id: $('#steam_id').val(), picture: $('#picture_url').val()}
    socket.emit('add player', player);
    $('#player_name').val('');
    $('#steam_id').val('');
    $('#picture_url').val('');
    return false;
  });

  $('#game').submit(function(){
    var game = {title: $('#title').val(), team1: $('#team1_name').val(), team2: $('#team2_name').val()}
    socket.emit('add game', game);
     $('#title').val('');
    return false;
  });

  socket.on('populate select', function(data) {
    var select = '';
    select += "<option value='" + data.id + "' data-icon='../../frontserver/public/" + data.logo + "' class=''>" + data.name + "</option>";
    $("#team_list").append(select);
    $("#team1_name").append(select);
    $("#team2_name").append(select);
    $('select').material_select();
  });

  socket.on('populate players', function(data) {
    console.log(data);
    $("#player-list").append(data);
  });


  socket.on('team added', function(data) {
    Materialize.toast(data + " added succesfully!", 4000);
  });

  socket.on('player added', function(data) {
    Materialize.toast(data + " added succesfully!", 4000);
  });

  socket.on('game added', function(data) {
    Materialize.toast(data + " added succesfully!", 4000);
  });

});
