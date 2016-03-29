$(function() {
  //counter to see what page you're on.
  var current_tab = 'initial pageload';

  var id = "";
  var socket = io();
  socket.on('connectedUsers', function(data) {
  });

//get alias
  socket.on('getAlias', function(results){
    // console.log(results.rows);
    var playerArr = [];
    for(var i = 0; i<results.rows.length; i++){
      playerArr.push(results.rows[i].alias);
    }
    playerArr.sort();
    console.log(playerArr);
    $('liveScoreBoard')
  });

  socket.on('getKills', function(results) {
    console.log(results);
  });



//when you click on a maintab button it fades in 'this' info and hides all siblings info;
  $(".mainTab").on('click',function(){
    console.log('click');
    var table = $(this)[0].id;
    var page = $('navBar');
    $(this).closest("#navBar").find("[data-mainTab=" + table + "]").fadeIn().siblings().hide();
    current_tab = table;

  });




    // remove the appended tables on live_tab if you move away to another page
    if(current_tab != "mainLiveTab"){
      $('.container_data').remove();
    }



//////////////////////////////////
///* STATIC STATS STARTS HERE *///
//////////////////////////////////  
  
//GETTING DATA FROM DB RAW AND PARSING INTO VARIABLES
  var elo, avatar, alias, teamName, psr, logo;
  socket.on('statData', function(data){
    var parse = data.rows
    var i = 0;

    elo = parse[i].elo;
    avatar = parse[i].picture;
    alias = parse[i].alias;
    teamName = parse[i].name;
    psr = parse[i].psr;
    logo = parse[i].logo; 


  });

  //LOADS STAT PAGE
  $("#mainStatTab").on('click', function(){
    //select name to fill stat table
    var searchPlayer = "shroud";
    console.log('Loading Data for Player:' + searchPlayer);
    //APPENDING PICTURE
    $('#teamLogo').append('<img src='+ +'/>');        //need to added image to this line of code
    //APPENDING LOGO
    $('#teamLogo').append('<img src='+ +'/>');        //need to added image to this line of code
  
    //CHANGING TABLE
    $('.mainStat').find('tbody').find('tr:nth-child(1)').find('td:nth-child(2)').text('');
    $('.mainStat').find('tbody').find('tr:nth-child(1)').find('td:nth-child(3)').text('');

    $('.mainStat').find('tbody').find('tr:nth-child(7)').find('td:nth-child(2)').text('');
    $('.mainStat').find('tbody').find('tr:nth-child(7)').find('td:nth-child(3)').text('');

    //win/loss ratio and sides
    socket.emit('getWinLossData', searchPlayer);

    //average kill death assists for stat table
    socket.emit('getKDA', searchPlayer);
  });

  //replacing KDA on stat table
  socket.on('printWinLoss', function(data){
    // console.log(data);

    var totalGames = data.rows.length;
    var gamesWon = data.rows.filter(function(value) { return value.team_won === 'Cloud9' }).length;
    var gamesLost = totalGames - gamesWon;
    var wonTerrorist = data.rows.filter(function(value) { return value.team_won === 'Cloud9' && value.winning_side === 'Terrorist' }).length;
    var lossTerrorist = data.rows.filter(function(value) { return value.team_won !== 'Cloud9' && value.winning_side === 'Terrorist' }).length;

    $('.mainStat').find('tbody').find('tr:nth-child(2)').find('td:nth-child(2)').text((gamesWon/totalGames*100).toFixed(2) + '%');
    $('.mainStat').find('tbody').find('tr:nth-child(3)').find('td:nth-child(2)').text((wonTerrorist/gamesWon*100).toFixed(2) + '%');
    $('.mainStat').find('tbody').find('tr:nth-child(4)').find('td:nth-child(2)').text(((1-(wonTerrorist/gamesWon))*100).toFixed(2) + '%');
    $('.mainStat').find('tbody').find('tr:nth-child(5)').find('td:nth-child(2)').text((lossTerrorist/gamesLost*100).toFixed(2) + '%');    
    $('.mainStat').find('tbody').find('tr:nth-child(6)').find('td:nth-child(2)').text(((1-(lossTerrorist/gamesLost))*100).toFixed(2) + '%');
  });

  //replacing KDA on stat table ALL player's average
  socket.on('printWinLossALL', function(data){
    // console.log(data);
    var totalGames = data.rows.length;
    var gamesWon = data.rows.filter(function(value) { return value.team_won }).length/2;
    var gamesLost = totalGames - gamesWon;
    var wonTerrorist = data.rows.filter(function(value) { return value.winning_side === 'Terrorist' }).length;
    var lossTerrorist = data.rows.filter(function(value) { return value.winning_side === 'Terrorist' }).length;

    $('.mainStat').find('tbody').find('tr:nth-child(2)').find('td:nth-child(3)').text((gamesWon/totalGames*100).toFixed(2) + '%');
    $('.mainStat').find('tbody').find('tr:nth-child(3)').find('td:nth-child(3)').text((wonTerrorist/totalGames*100).toFixed(2) + '%');
    $('.mainStat').find('tbody').find('tr:nth-child(4)').find('td:nth-child(3)').text(((1-(wonTerrorist/totalGames))*100).toFixed(2) + '%');
    $('.mainStat').find('tbody').find('tr:nth-child(5)').find('td:nth-child(3)').text((lossTerrorist/totalGames*100).toFixed(2) + '%');    
    $('.mainStat').find('tbody').find('tr:nth-child(6)').find('td:nth-child(3)').text(((1-(lossTerrorist/totalGames))*100).toFixed(2) + '%');
  });

  //replacing KDA on stat table
  socket.on('printKDA', function(data){
    // console.log(data);
    var searchPlayer = data.rows[0].playerName;
    var sumKills = data.rows[0].sum_kills;
    var damageKill = (data.rows[0].avg_damage/data.rows[0].avg_kills*100).toFixed(2);
    // console.log(damageKill);

    $('.mainStat').find('tbody').find('tr:nth-child(7)').find('td:nth-child(2)').text((data.rows[0].avg_kills/data.rows[0].avg_deaths).toFixed(2));
    $('.mainStat').find('tbody').find('tr:nth-child(9)').find('td:nth-child(2)').text(data.rows[0].avg_kills/100);
    $('.mainStat').find('tbody').find('tr:nth-child(10)').find('td:nth-child(2)').text(data.rows[0].avg_deaths/100);
    $('.mainStat').find('tbody').find('tr:nth-child(11)').find('td:nth-child(2)').text(data.rows[0].avg_assists/100);  
    $('.mainStat').find('tbody').find('tr:nth-child(12)').find('td:nth-child(2)').text(data.rows[0].avg_damage);
    $('.mainStat').find('tbody').find('tr:nth-child(13)').find('td:nth-child(2)').text(damageKill);  

    //kill participation
    socket.emit('getKillPart', searchPlayer);
    //replacing kill partication on stat table
    socket.on('printKillPart', function(data){
      // console.log(sumKills);
      // console.log(data.rows[0].sum_team_kills);

      var killParticipation = (sumKills * 100 / data.rows[0].sum_team_kills).toFixed(2);
      $('.mainStat').find('tbody').find('tr:nth-child(8)').find('td:nth-child(2)').text(killParticipation + '%');      
    });

  });

  //replacing KDA on stat table for All player's average
  socket.on('printKDAALL', function(data){
    // console.log(data);
    var searchPlayer = data.rows[0].playerName;
    var sumKills = data.rows[0].sum_kills;
    var damageKill = (data.rows[0].avg_damage/data.rows[0].avg_kills*100).toFixed(2);
    // console.log(sumKills);

    $('.mainStat').find('tbody').find('tr:nth-child(7)').find('td:nth-child(3)').text((data.rows[0].avg_kills/data.rows[0].avg_deaths).toFixed(2));
    $('.mainStat').find('tbody').find('tr:nth-child(9)').find('td:nth-child(3)').text(data.rows[0].avg_kills/100);
    $('.mainStat').find('tbody').find('tr:nth-child(10)').find('td:nth-child(3)').text(data.rows[0].avg_deaths/100);
    $('.mainStat').find('tbody').find('tr:nth-child(11)').find('td:nth-child(3)').text(data.rows[0].avg_assists/100);  
    $('.mainStat').find('tbody').find('tr:nth-child(12)').find('td:nth-child(3)').text(data.rows[0].avg_damage);
    $('.mainStat').find('tbody').find('tr:nth-child(13)').find('td:nth-child(3)').text(damageKill);  
  
    //kill participation
    socket.emit('getKillPartALL', searchPlayer);
    //replacing kill partication on stat table
    socket.on('printKillPartALL', function(data){
      // console.log(data);
      // console.log(data.rows[0].sum_team_kills);
      var myKills = 0;
      var ourKills = 0;
      for (i=0;i<data.rows.length;i++){
        myKills += data.rows[i].my_kills;
        ourKills += +data.rows[i].our_kills;
      }

      var killParticipation = (sumKills * 100 / data.rows[0].sum_team_kills).toFixed(2);
      $('.mainStat').find('tbody').find('tr:nth-child(8)').find('td:nth-child(3)').text((myKills/ourKills).toFixed(2)+"%");
      
    });
  });


  // CLICKING TABS ON TABLE TO CHANGE DATA
  $(".statTableTabs").on('click',function(){
    var table = $(this)[0].id;
    //$("*[data-tableNum=" + table + "]").removeClass('fade').siblings().addClass('fade');
 
    socket.emit('wantTable', table);

    socket.on('getTable', function(stat){
      console.log('addData');
      addData(stat);
    });
  });

  //STATIC GRAPH
  var PSR = [170, 169, 195, 145, 182, 215, 252, 265, 233, 183, 139, 296];
  var MVP = [200, 300, 500, 1100, 1700, 1200, 1248, 1241, 1201, 1141, 1806, 1525];
 
  $('#statGraphContainer').highcharts({
    chart: {
        backgroundColor: 'rgba(255,225,225,0.8)',
    },
    title: {
      text: 'Player\'s Rating',
      x: -20 //center
    },
    xAxis: {
      categories: []
    },
    yAxis: {
      title: {
        text: 'Score'
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      borderWidth: 0
    },
    series: [{
      name: 'ProStatRanking',
      data: PSR
    }, {
      name: 'Most Valuable Player',
      data: MVP
    }]
  });


////////////////////////////////
///* STATIC STATS ENDS HERE *///
////////////////////////////////  

//global variable counter for last 10 games
var counter = 0;
$(window).scroll(function () {
   if (current_tab == "mainLiveTab" && $(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
      console.log($(window).scrollTop());//Add something at the end of the page

      if(counter < 10){
      var table = $('#sb_table').html()
      $(table).hide().appendTo('#parent_sb').fadeIn(1000);
      counter += 1
      console.log(counter);
      // $('#parent_sb').append(table).hide().fadeIn(500);
    }else{
      console.log("last 10 done");
    }
  }
});
})

