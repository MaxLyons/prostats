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

  socket.on('player count', function(data) {
    $("#totalplayerstracked").text(data);
    $(".landstats").fadeIn(600);
  });

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
        games_collection[i].team1logo = results.rows[i].t1logo;
        games_collection[i].team2logo = results.rows[i].t2logo;

      }
    };
  })


  $("#logo").on('click', function(e){
    e.preventDefault();
    $(".fade").fadeOut();
    $("#livegames").fadeOut();
    $(".landing").fadeIn();
    $(".landstats").hide().fadeIn(700);
  });

  $("#mainLiveTab").on('click', function(){
    $("#livegames").empty();
    table = $(this)[0].id;
    $(".landing").fadeOut();
    $("[data-mainTab=mainStatTab]").fadeOut();
    $("[data-mainTab=mainLiveTab]").fadeIn();
    for (var y = 0; y < games_collection.length; y ++) {
      var game = games_collection[y];
      var liveScoreboard = "";
      liveScoreboard += "<div class='livescoreboard'>";
      liveScoreboard += "<table class='table' cellspacing='0' cellpadding='0' text-center >";
      liveScoreboard += "<tr>";
      liveScoreboard += "<thead class='scoreheader'>";
      liveScoreboard += "<tr>";
      liveScoreboard += "<div class='gameheader'>";
      liveScoreboard += "<ul>";
      liveScoreboard += "<span class='matchname'>" + game.event + "</span>";
      liveScoreboard += "<span class='map'>" + game.map + "</span>";
      liveScoreboard += "</ul>";
      liveScoreboard += "</div>";
      liveScoreboard += "</tr>";
      liveScoreboard += "<tr>";
      liveScoreboard += "<th class='text-center'>Picture</th>";
      liveScoreboard += "<th class='text-center'>Alias</th>";
      liveScoreboard += "<th class='text-center'>K</th>";
      liveScoreboard += "<th class='text-center'>D</th>";
      liveScoreboard += "<th class='text-center'>A</th>";
      liveScoreboard += "<th class='text-center'>K/D</th>";
      liveScoreboard += "<th class='text-center'>PSR</th>";
      liveScoreboard += "</tr>";
      liveScoreboard += "</thead>";
      liveScoreboard += "<tbody class='ct'>";
      for (var i = 0; i < game.team1players.length; i ++) {
        var player = game.team1players[i];
        liveScoreboard += "<tr>";
        liveScoreboard += "<td class='avatar_row'><img class='playeravatar' src='" + player.avatar + "'></td>";
        liveScoreboard += "<td class='alias_row'>" + player.alias + "</td>";
        liveScoreboard += "<td class='k_row'>" + player.kills + "</td>";
        liveScoreboard += "<td class='d_row'>" + player.deaths + "</td>";
        liveScoreboard += "<td class='a_row'>" + player.assists + "</td>";
        liveScoreboard += "<td class='kd_row'>" + Math.round((player.kills/player.deaths) * 100) / 100 + "</td>";
        liveScoreboard += "<td class='psr_row'>47%</td>";
        liveScoreboard += "</tr>";
      }
      liveScoreboard += "</tbody>";
      liveScoreboard += "<tr>";
      liveScoreboard += "<td class='scoremiddle' colspan='9'>";
      liveScoreboard += "<div class='ct_score'>";
      liveScoreboard += "<ul>";
      liveScoreboard += "<span class='score'>" + game.ct_score + "</span>";
      liveScoreboard += "<span class='team_score'>" + game.team1 + " <img class='teamavatar' src='" + game.team1logo + "'></span>";
      liveScoreboard += "</ul>";
      liveScoreboard += "</div>";
      liveScoreboard += "</br>";
      liveScoreboard += "<div class='t_score'>";
      liveScoreboard += "<ul>";
      liveScoreboard += "<span class='score'>" + game.t_score + "</span>";
      liveScoreboard += "<span class='team_score'>" + game.team2 + " <img class='teamavatar' src='" + game.team2logo + "'></span>";
      liveScoreboard += "</ul>";
      liveScoreboard += "</div>";
      liveScoreboard += "</td>";
      liveScoreboard += "</tr>";
      liveScoreboard += "<tbody class='terrorist'>";
      for (var i = 0; i < game.team2players.length; i ++) {
        var player = game.team2players[i];
        liveScoreboard += "<tr>";
        liveScoreboard += "<td class='avatar_row'><img class='playeravatar' src='" + player.avatar + "'></td>";
        liveScoreboard += "<td class='alias_row'>" + player.alias + "</td>";
        liveScoreboard += "<td class='k_row'>" + player.kills + "</td>";
        liveScoreboard += "<td class='d_row'>" + player.deaths + "</td>";
        liveScoreboard += "<td class='a_row'>" + player.assists + "</td>";
        liveScoreboard += "<td class='kd_row'>" + Math.round((player.kills/player.deaths) * 100) / 100 + "</td>";
        liveScoreboard += "<td class='psr_row'>47%</td>";
        liveScoreboard += "</tr>";
      }
      liveScoreboard += "</tbody>";
      liveScoreboard += "</table>";
      liveScoreboard += "</div>";
      $("#livegames").append(liveScoreboard);
    }
  })

      $(document).on('click', '.alias_row', function() {
        searchPlayer($(this).text());
      })




  // remove the appended tables on live_tab if you move away to another page
  if(current_tab != "mainLiveTab"){
    $('.container_data').remove();
  }




  //////////////////////////////////
  ///* STATIC STATS STARTS HERE *///
  //////////////////////////////////

  //load player page by player name
  function clearOtherPage(callback){
    $(".landing").fadeOut();
    $("[data-mainTab=mainLiveTab]").fadeOut();
    $("[data-mainTab=mainStatTab]").fadeOut();
    $(".mainStat thead").remove();
    $(".mainStat tbody").remove();
    $("#playerAvatar").find('img').remove();
    $("#teamLogo").find('img').remove();
    $("#statPlayerName").find('h1').remove();

    callback();
  };

  function fadeInPage(page){
    $("[data-mainTab="+page+"]").fadeIn();
  };

  function searchPlayer(player){
    socket.emit('searchPlayerName', player);
  };

  //Load Stat Page Function
  function LoadStatPage(searchPlayer){
    table = $(this)[0].id;
    clearOtherPage(function(){ fadeInPage("mainStatTab")});

    var trHeadName = ['GAME STATS', 'Player', 'All Player Average'];
    var trBodyName = ['ProStat Ranking', 'Win', 'Winning as Terrorist', 'Winning as Counter-Terrorist',
      'Losing as Terrorist', 'Losing as Counter-Terrorist', 'KD', 'Kill Participation', 'Average Kills',
      'Average Deaths', 'Average Assists', 'Average Damage'];

    var thead = $('<thead class="mainhead">').appendTo('.mainStat');
    var trHead = $('<tr>').appendTo(thead);
    for (i=0;i<trHeadName.length;i++){
      $('<th>').text(trHeadName[i]).appendTo(trHead);
    }

    var tbody = $('<tbody>').appendTo('.mainStat');
    for (i=0;i<trBodyName.length;i++){
      var trBody = $('<tr>').appendTo(tbody);
      $('<td>').text(trBodyName[i]).appendTo(trBody);
      $('<td>').appendTo(trBody);
      $('<td>').appendTo(trBody);

    }
    //average kill death assists for stat table
    socket.emit('getKDA', searchPlayer);
  };

  function checkNaN(x){
    if(isNaN(x)){
      return 0;
    } else {
      return x;
    }
  }

  //navbar search bar
  $('#searchbar').on('submit', function(){
      var player = $('#search').val();
      searchPlayer(player);
    return false;
  });

    //LOADS STAT PAGE
  $("#mainStatTab").on('click', function(){
    LoadStatPage("shroud");
  });

  socket.on('getPlayerName', function(data){
    if (data.rows[0] != undefined){
      LoadStatPage(data.rows[0].alias);
    }
  });

  //GETTING DATA FROM DB RAW AND PARSING INTO VARIABLES
  var elo, avatar, alias, teamName, psr, logo;
  socket.on('statData', function(data){
    var parse = data.rows;
    var i = 0;

    avatar = parse[i].picture;
    alias = parse[i].alias;
    teamName = parse[i].name;
    logo = parse[i].logo;

    //APPENDING NAME
    $('<div class="playname" >').text(alias).appendTo('#statPlayerName');

    //APPENDING PICTURE
    $('#statPlayerName').prepend("<img id='playerAvatar' src='"+ avatar +"'/>");
    $('#statPlayerName').prepend("<img id='teamLogo' src='"+ logo +"'/>");

  });

  //replacing KDA on stat table
  socket.on('printWinLoss', function(data){

    var totalGames = data.rows.length;
    var gamesWon = data.rows.filter(function(value) { return value.team_won === 'Cloud9' }).length;
    var gamesLost = totalGames - gamesWon;
    var wonTerrorist = data.rows.filter(function(value) { return value.team_won === 'Cloud9' && value.winning_side === 'Terrorist' }).length;
    var lossTerrorist = data.rows.filter(function(value) { return value.team_won !== 'Cloud9' && value.winning_side === 'Terrorist' }).length;

    $('.mainStat').find('tbody').find('tr:nth-child(2)').find('td:nth-child(2)').text(checkNaN((gamesWon/totalGames*100).toFixed(2)) + '%');
    $('.mainStat').find('tbody').find('tr:nth-child(3)').find('td:nth-child(2)').text(checkNaN((wonTerrorist/gamesWon*100).toFixed(2)) + '%');
    $('.mainStat').find('tbody').find('tr:nth-child(4)').find('td:nth-child(2)').text(checkNaN(((1-(wonTerrorist/gamesWon))*100).toFixed(2)) + '%');
    $('.mainStat').find('tbody').find('tr:nth-child(5)').find('td:nth-child(2)').text(checkNaN((lossTerrorist/gamesLost*100).toFixed(2)) + '%');
    $('.mainStat').find('tbody').find('tr:nth-child(6)').find('td:nth-child(2)').text(checkNaN(((1-(lossTerrorist/gamesLost))*100).toFixed(2)) + '%');
  });

  //replacing KDA on stat table ALL player's average
  socket.on('printWinLossALL', function(data){

    var totalGames = data.rows.length;
    var gamesWon = data.rows.filter(function(value) { return value.team_won }).length/2;
    var gamesLost = totalGames - gamesWon;
    var wonTerrorist = data.rows.filter(function(value) { return value.winning_side === 'Terrorist' }).length;
    var lossTerrorist = data.rows.filter(function(value) { return value.winning_side === 'Terrorist' }).length;


    $('.mainStat').find('tbody').find('tr:nth-child(2)').find('td:nth-child(3)').text(checkNaN((gamesWon/totalGames*100).toFixed(2)) + '%');
    $('.mainStat').find('tbody').find('tr:nth-child(3)').find('td:nth-child(3)').text(checkNaN((wonTerrorist/totalGames*100).toFixed(2)) + '%');
    $('.mainStat').find('tbody').find('tr:nth-child(4)').find('td:nth-child(3)').text(checkNaN(((1-(wonTerrorist/totalGames))*100).toFixed(2)) + '%');
    $('.mainStat').find('tbody').find('tr:nth-child(5)').find('td:nth-child(3)').text(checkNaN((lossTerrorist/totalGames*100).toFixed(2)) + '%');
    $('.mainStat').find('tbody').find('tr:nth-child(6)').find('td:nth-child(3)').text(checkNaN(((1-(lossTerrorist/totalGames))*100).toFixed(2)) + '%');
  });

  //replacing KDA & KP & PSR on stat table
  socket.on('printKDA', function(data){
    data = data.rows[0];
    var searchPlayer = data.playerName;
    var sumKills = data.sum_kills;
    var PSRArr = [];

    $('.mainStat').find('tbody').find('tr:nth-child(7)').find('td:nth-child(2)').text(checkNaN((data.avg_kills/data.avg_deaths).toFixed(2)));
    $('.mainStat').find('tbody').find('tr:nth-child(9)').find('td:nth-child(2)').text(checkNaN(data.avg_kills/100));
    $('.mainStat').find('tbody').find('tr:nth-child(10)').find('td:nth-child(2)').text(checkNaN(data.avg_deaths/100));
    $('.mainStat').find('tbody').find('tr:nth-child(11)').find('td:nth-child(2)').text(checkNaN(data.avg_assists/100));
    $('.mainStat').find('tbody').find('tr:nth-child(12)').find('td:nth-child(2)').text(checkNaN(data.avg_damage));

    //kill participation
    socket.emit('getKillPart', {query: searchPlayer, sk: PSRArr, sa: sumKills});
  });

  //replacing kill partication on stat table
  socket.on('printKillPart', function(data0){
    var data = data0.res;
    var sumKills = data0.sk;
    console.log(data);
    console.log(sumKills);
    var killParticipation = (sumKills * 100 / data.rows[0].sum_team_kills).toFixed(2);
    $('.mainStat').find('tbody').find('tr:nth-child(8)').find('td:nth-child(2)').text(checkNaN(killParticipation) + '%');
  });

  socket.on('PSR', function(data0){
    var data = data0.res;
    var PSRArr = data0.sk;
    var gameCount = 0;
    while (gameCount<data.rows.length){
      var kills = +data.rows[gameCount].sum_kills;
      var deaths = +data.rows[gameCount].sum_deaths;
      var damage = +data.rows[gameCount].sum_damage;

      PSRArr[gameCount] = +((10*damage/kills)+(100*kills)-(75*deaths)).toFixed(0);
      gameCount ++;
    }
    var PSR = PSRArr.reduce(function(a,b){
      return a+b;
    });
    PSR = (PSR/PSRArr.length).toFixed(0);

    $('.mainStat').find('tbody').find('tr:nth-child(1)').find('td:nth-child(2)').text(checkNaN(PSR));

    //STATIC GRAPH PSR
    $('#statGraphContainer').highcharts({
      chart: {
          backgroundColor: 'rgba(0,0,0,0.8)',
      },
      title: {
        text: 'Player\'s Rating',
        x: -20 //center
      },
      xAxis: {
        categories: [1,2,3,4,5]
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
        data: PSRArr
      }]
    });
  });

  //print PSR for all player average
  socket.on('PSRALL', function(data0){
    var data = data0.res;
    var gameCount = 0;
    var PSRArrAll =[];
    while (gameCount<data.rows.length){
      var kills = +data.rows[gameCount].sum_kills;
      var deaths = +data.rows[gameCount].sum_deaths;
      var damage = +data.rows[gameCount].sum_damage;

      PSRArrAll[gameCount] = +((10*damage/kills)+(100*kills)-(75*deaths)).toFixed(0);
      gameCount ++;
    }
    var PSR = PSRArrAll.reduce(function(a,b){
      return a+b;
    });
    PSR = (PSR/PSRArrAll.length).toFixed(0);
    $('.mainStat').find('tbody').find('tr:nth-child(1)').find('td:nth-child(3)').text(checkNaN(PSR));
  });

  //replacing KDA on stat table for All player's average
  socket.on('printKDAALL', function(data){
    data = data.rows[0];
    var searchPlayer = data.playerName;
    var sumKills = data.sum_kills;

    $('.mainStat').find('tbody').find('tr:nth-child(7)').find('td:nth-child(3)').text(checkNaN((data.avg_kills/data.avg_deaths).toFixed(2)));
    $('.mainStat').find('tbody').find('tr:nth-child(9)').find('td:nth-child(3)').text(checkNaN(data.avg_kills/100));
    $('.mainStat').find('tbody').find('tr:nth-child(10)').find('td:nth-child(3)').text(checkNaN(data.avg_deaths/100));
    $('.mainStat').find('tbody').find('tr:nth-child(11)').find('td:nth-child(3)').text(checkNaN(data.avg_assists/100));
    $('.mainStat').find('tbody').find('tr:nth-child(12)').find('td:nth-child(3)').text(checkNaN(data.avg_damage));

    //kill participation
    socket.emit('getKillPartALL', {query: searchPlayer, sk: sumKills} );

  });

  //replacing kill partication on stat table
  socket.on('printKillPartALL', function(data0){
    var data = data0.res;
    var sumKills = data0.sk;
    var myKills = 0;
    var ourKills = 0;
    for (i=0;i<data.rows.length;i++){
      myKills += data.rows[i].my_kills;
      ourKills += +data.rows[i].our_kills;
    }

    var killParticipation = (sumKills * 100 / data.rows[0].sum_team_kills).toFixed(2);
    $('.mainStat').find('tbody').find('tr:nth-child(8)').find('td:nth-child(3)').text((myKills*100/ourKills).toFixed(2)+"%");
    $('.mainStat').find('tbody').find('tr:nth-child(8)').find('td:nth-child(3)').text(checkNaN((myKills*100/ourKills).toFixed(2))+"%");
  });

/*LIVE STATS TAB */


  // CLICKING TABS ON TABLE TO CHANGE DATA
  $(".statTableTabs").on('click',function(){
    var table = $(this)[0].id;
    $("*[data-tableNum=" + table + "]").removeClass('fade').siblings().addClass('fade');

    socket.emit('wantTable', table);

    socket.on('getTable', function(stat){
      addData(stat);
    });
  });

  ////////////////////////////////
  ///* STATIC STATS ENDS HERE *///
  ////////////////////////////////


  socket.on('getKDAmatches', function(results){
    for(var j = 0; j < games_collection.length; j++){
      games_collection[j].team1players = [];
      games_collection[j].team2players = [];
      ;
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
  });


  //catching information about team sides
  socket.on('team_side', function(results){
    console.log(results);
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
