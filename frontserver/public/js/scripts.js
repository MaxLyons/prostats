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
    console.log('this is the stat page');
    //APPENDING PICTURE
    $('#teamLogo').append('<img src='+ +'/>');        //need to added image to this line of code
    //APPENDING LOGO
    $('#teamLogo').append('<img src='+ +'/>');        //need to added image to this line of code
  
    //CHANGING TABLE
    $('.mainStat').find('tbody').find('tr:nth-child(1)').find('td:nth-child(2)').text('HELLO');
    $('.mainStat').find('tbody').find('tr:nth-child(1)').find('td:nth-child(3)').text('HELLO');

    $('.mainStat').find('tbody').find('tr:nth-child(2)').find('td:nth-child(2)').text('HELLO');
    $('.mainStat').find('tbody').find('tr:nth-child(2)').find('td:nth-child(3)').text('HELLO');

    $('.mainStat').find('tbody').find('tr:nth-child(3)').find('td:nth-child(2)').text('HELLO');
    $('.mainStat').find('tbody').find('tr:nth-child(3)').find('td:nth-child(3)').text('HELLO');

    $('.mainStat').find('tbody').find('tr:nth-child(4)').find('td:nth-child(2)').text('HELLO');
    $('.mainStat').find('tbody').find('tr:nth-child(4)').find('td:nth-child(3)').text('HELLO');

    $('.mainStat').find('tbody').find('tr:nth-child(5)').find('td:nth-child(2)').text('HELLO');
    $('.mainStat').find('tbody').find('tr:nth-child(5)').find('td:nth-child(3)').text('HELLO');

    $('.mainStat').find('tbody').find('tr:nth-child(6)').find('td:nth-child(2)').text('HELLO');
    $('.mainStat').find('tbody').find('tr:nth-child(6)').find('td:nth-child(3)').text('HELLO');

    $('.mainStat').find('tbody').find('tr:nth-child(7)').find('td:nth-child(2)').text('HELLO');
    $('.mainStat').find('tbody').find('tr:nth-child(7)').find('td:nth-child(3)').text('HELLO');

    $('.mainStat').find('tbody').find('tr:nth-child(8)').find('td:nth-child(2)').text('HELLO');
    $('.mainStat').find('tbody').find('tr:nth-child(8)').find('td:nth-child(3)').text('HELLO');

    $('.mainStat').find('tbody').find('tr:nth-child(9)').find('td:nth-child(2)').text('HELLO');
    $('.mainStat').find('tbody').find('tr:nth-child(9)').find('td:nth-child(3)').text('HELLO');

    $('.mainStat').find('tbody').find('tr:nth-child(10)').find('td:nth-child(2)').text('HELLO');
    $('.mainStat').find('tbody').find('tr:nth-child(10)').find('td:nth-child(3)').text('HELLO');
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

