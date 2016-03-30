$(function() {
  //counter to see what page you're on.
  var current_tab = 'initial pageload';

  var id = "";
  var socket = io();
  socket.on('connectedUsers', function(data) {
  });

  socket.on('game count', function(data) {
    $("#totalgamestracked").text(data);
  });

  socket.on('team count', function(data) {
    $("#totalteamstracked").text(data);
  });

  socket.on('n0thing', function(data) {
    $("#n0thing").attr("src", data);
  });

  socket.on('player count', function(data) {
    $("#totalplayerstracked").text(data);
    $(".landstats").fadeIn(600);
  });

  // get alias
  socket.on('getAlias', function(results){
    for(var i = 0; i<results.rows.length; i++){
      console.log(results.rows[i]);
    }
  });

  // socket.on('getAlias', function(results) {
  //   console.log(results);
  // });



  //when you click on a maintab button it fades in 'this' info and hides all siblings info;
  $(".mainTab").on('click',function(){
    console.log('click');
    var table = $(this)[0].id;
    var page = $('navBar');
    $("[data-mainTab=" + table + "]").fadeIn().siblings().hide();
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



  /*LIVE STATS TAB */


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

  //global variable to stop appending after the last 10 games
  //Felix
  //global function for games table players data nased on game_id
  var eventmap = [];
  var gtp1Arr = [];
  var gtp2Arr = [];
  var kda = [];
  var team_sides = [];

  //collection of games we pulled from the database
  var games_collection = [];


  socket.on('getEvents', function(results){
    console.log(results);
    for(var i = 0; i < results.rows.length; i++){
      if(games_collection[i] === undefined || results.rows[i].match_id != games_collection[i].match_id){
        games_collection[i] = new Object();
        games_collection[i].match_id = results.rows[i].match_id;
        games_collection[i].event = results.rows[i].event;
        games_collection[i].map = results.rows[i].map;
        games_collection[i].team1 = results.rows[i].t1name;
        games_collection[i].team2 = results.rows[i].t2name;

      }
    };
    console.log(games_collection);

  })



  socket.on('getKDAmatches', function(results){
    console.log(results);


    for(var j = 0; j < games_collection.length; j++){
      games_collection[j].team1players = [];
      games_collection[j].team2players = [];

      for(var i = 0; i < results.rows.length; i++){

        if(games_collection[j].match_id == results.rows[i].game_id){
          if (games_collection[j].team1 ==  results.rows[i].team) {

            games_collection[j].team1players.push(results.rows[i]);
          } else {
            games_collection[j].team2players.push(results.rows[i]);
          }
        }
      }
    }
    console.log("now logging games_collection");
    console.log(games_collection);
  });


  //catching information about team sides
  socket.on('team_side', function(results){
    console.log(results.rows);
    for(var i = 0; i < results.rows.length; i ++){
      if(games_collection[i] === undefined || results.rows[i].ct_score != games_collection[i].ct_score){
        games_collection[i].ct_score = results.rows[i].ct_score;
        games_collection[i].t_score = results.rows[i].t_score;
        games_collection[i].team_won = results.rows[i].team_won;
        games_collection[i].winning_side = results.rows[i].winning_side;
      }
    }
    console.log(games_collection);
  });

  //comparing length of uniqueGame_Arr as a secondary counter to the number of games to append
  var uniqueGame_Arr = [];
  socket.on('game_ids',function(results){
    for(var i = 0; i < results.rows.length; i++){
      uniqueGame_Arr.push(results.rows[i].match_id);
    }
    console.log('there are ' + uniqueGame_Arr.length + " games to append");
  });

  var counter = 0;

  $(window).scroll(function () {
    if (current_tab == "mainLiveTab" && $(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
      console.log($(window).scrollTop());//Add something at the end of the page

      if(counter < 10 && counter < games_collection.length){
        //html() doesn't work in this case. changes the html into an object. USE CLONE();
        var template = $('#sb_table').clone();
        var tableClone = template;

        //finding clone thead event header
        var header = ($(tableClone).find('.header1').text(''));

        //finding clone map header
        var map = ($(tableClone).find('#map').text(''));

        //finding ct player 1-5
        var ctOne = $(tableClone).find('.ct tr').eq(0);
        var ctTwo = $(tableClone).find('.ct tr').eq(1);
        var ctThree = $(tableClone).find('.ct tr').eq(2);
        var ctFour = $(tableClone).find('.ct tr').eq(3);
        var ctFive = $(tableClone).find('.ct tr').eq(4);

        //data fields 1-8
        //player 1
        var fieldOne = ($(ctOne).find('td').eq(0).text(''));
        var fieldTwo = ($(ctOne).find('td').eq(1).text(''));
        var fieldThree = ($(ctOne).find('td').eq(2).text(''));
        var fieldFour = ($(ctOne).find('td').eq(3).text(''));
        var fieldFive = ($(ctOne).find('td').eq(4).text(''));
        var fieldSix = ($(ctOne).find('td').eq(5).text(''));
        var fieldSeven = ($(ctOne).find('td').eq(6).text(''));
        var fieldEight = ($(ctOne).find('td').eq(7).text(''));

        //player2
        var fieldOne = ($(ctTwo).find('td').eq(0).text(''));
        var fieldTwo = ($(ctTwo).find('td').eq(1).text(''));
        var fieldThree = ($(ctTwo).find('td').eq(2).text(''));
        var fieldFour = ($(ctTwo).find('td').eq(3).text(''));
        var fieldFive = ($(ctTwo).find('td').eq(4).text(''));
        var fieldSix = ($(ctTwo).find('td').eq(5).text(''));
        var fieldSeven = ($(ctTwo).find('td').eq(6).text(''));
        var fieldEight = ($(ctTwo).find('td').eq(7).text(''));

        //player3
        var fieldOne = ($(ctThree).find('td').eq(0).text(''));
        var fieldTwo = ($(ctThree).find('td').eq(1).text(''));
        var fieldThree = ($(ctThree).find('td').eq(2).text(''));
        var fieldFour = ($(ctThree).find('td').eq(3).text(''));
        var fieldFive = ($(ctThree).find('td').eq(4).text(''));
        var fieldSix = ($(ctThree).find('td').eq(5).text(''));
        var fieldSeven = ($(ctThree).find('td').eq(6).text(''));
        var fieldEight = ($(ctThree).find('td').eq(7).text(''));

        //player4
        var fieldOne = ($(ctFour).find('td').eq(0).text(''));
        var fieldTwo = ($(ctFour).find('td').eq(1).text(''));
        var fieldThree = ($(ctFour).find('td').eq(2).text(''));
        var fieldFour = ($(ctFour).find('td').eq(3).text(''));
        var fieldFive = ($(ctFour).find('td').eq(4).text(''));
        var fieldSix = ($(ctFour).find('td').eq(5).text(''));
        var fieldSeven = ($(ctFour).find('td').eq(6).text(''));
        var fieldEight = ($(ctFour).find('td').eq(7).text(''));

        //player5 fields
        var fieldOne = ($(ctFive).find('td').eq(0).text(''));
        var fieldTwo = ($(ctFive).find('td').eq(1).text(''));
        var fieldThree = ($(ctFive).find('td').eq(2).text(''));
        var fieldFour = ($(ctFive).find('td').eq(3).text(''));
        var fieldFive = ($(ctFive).find('td').eq(4).text(''));
        var fieldSix = ($(ctFive).find('td').eq(5).text(''));
        var fieldSeven = ($(ctFive).find('td').eq(6).text(''));
        var fieldEight = ($(ctFive).find('td').eq(7).text(''));



        /////// TERRORIST SIDE /////////

        var terroristOne = $(tableClone).find('.terrorist tr').eq(0);
        var terroristTwo = $(tableClone).find('.terrorist tr').eq(1);
        var terroristThree = $(tableClone).find('.terrorist tr').eq(2);
        var terroristFour = $(tableClone).find('.terrorist tr').eq(3);
        var terroristFive = $(tableClone).find('.terrorist tr').eq(4);

        //data fields 1-8
        //player 1
        var tfieldOne = ($(terroristOne).find('td').eq(0).text(''));
        var tfieldTwo = ($(terroristOne).find('td').eq(1).text(''));
        var tfieldThree = ($(terroristOne).find('td').eq(2).text(''));
        var tfieldFour = ($(terroristOne).find('td').eq(3).text(''));
        var tfieldFive = ($(terroristOne).find('td').eq(4).text(''));
        var tfieldSix = ($(terroristOne).find('td').eq(5).text(''));
        var tfieldSeven = ($(terroristOne).find('td').eq(6).text(''));
        var tfieldEight = ($(terroristOne).find('td').eq(7).text(''));

        //player2
        var tfieldOne = ($(terroristTwo).find('td').eq(0).text(''));
        var tfieldTwo = ($(terroristTwo).find('td').eq(1).text(''));
        var tfieldThree = ($(terroristTwo).find('td').eq(2).text(''));
        var tfieldFour = ($(terroristTwo).find('td').eq(3).text(''));
        var tfieldFive = ($(terroristTwo).find('td').eq(4).text(''));
        var tfieldSix = ($(terroristTwo).find('td').eq(5).text(''));
        var tfieldSeven = ($(terroristTwo).find('td').eq(6).text(''));
        var tfieldEight = ($(terroristTwo).find('td').eq(7).text(''));

        //player3
        var tfieldOne = ($(terroristThree).find('td').eq(0).text(''));
        var tfieldTwo = ($(terroristThree).find('td').eq(1).text(''));
        var tfieldThree = ($(terroristThree).find('td').eq(2).text(''));
        var tfieldFour = ($(terroristThree).find('td').eq(3).text(''));
        var tfieldFive = ($(terroristThree).find('td').eq(4).text(''));
        var tfieldSix = ($(terroristThree).find('td').eq(5).text(''));
        var tfieldSeven = ($(terroristThree).find('td').eq(6).text(''));
        var tfieldEight = ($(terroristThree).find('td').eq(7).text(''));

        //player4
        var tfieldOne = ($(terroristFour).find('td').eq(0).text(''));
        var tfieldTwo = ($(terroristFour).find('td').eq(1).text(''));
        var tfieldThree = ($(terroristFour).find('td').eq(2).text(''));
        var tfieldFour = ($(terroristFour).find('td').eq(3).text(''));
        var tfieldFive = ($(terroristFour).find('td').eq(4).text(''));
        var tfieldSix = ($(terroristFour).find('td').eq(5).text(''));
        var tfieldSeven = ($(terroristFour).find('td').eq(6).text(''));
        var tfieldEight = ($(terroristFour).find('td').eq(7).text(''));

        //player5 fields
        var tfieldOne = ($(terroristFive).find('td').eq(0).text(''));
        var tfieldTwo = ($(terroristFive).find('td').eq(1).text(''));
        var tfieldThree = ($(terroristFive).find('td').eq(2).text(''));
        var tfieldFour = ($(terroristFive).find('td').eq(3).text(''));
        var tfieldFive = ($(terroristFive).find('td').eq(4).text(''));
        var tfieldSix = ($(terroristFive).find('td').eq(5).text(''));
        var tfieldSeven = ($(terroristFive).find('td').eq(6).text(''));
        var tfieldEight = ($(terroristFive).find('td').eq(7).text(''));







        $(tableClone).hide().appendTo('#parent_sb').fadeIn(1000);
        counter += 1;
      }else{
        console.log("last 10 done");
      }
    }
  });
})
