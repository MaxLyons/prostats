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
    var table = $(this)[0].id;
    var page = $('navBar');
    $(this).closest("#navBar").find("[data-mainTab=" + table + "]").fadeIn().siblings().hide();
    current_tab = table;

  });



    console.log(current_tab);
    // remove the appended tables on live_tab if you move away to another page
    if(current_tab != "mainLiveTab"){
      $('.container_data').remove();
    }
  });



/*append new information to a table to append*/


/* LIVE STATS TAB
  function addData (stat){
    console.log("I AM READING THE DATA");
  };

  socket.on('tableResults', function(results){
    console.log(results);
  });


  // CLICKING TABS ON TABLE TO CHANGE DATA
  $(".liveTableTabs").on('click',function(){
    var table = $(this)[0].id;
    $("*[data-tableNum=" + table + "]").removeClass('fade').siblings().addClass('fade');

    socket.emit('wantTable', table);

    socket.on('getTable', function(stat){
      console.log('addData');
      addData(stat);
    });

  });

  //CREATE BUBBLE GRAPHS FOR PLAYERS KILLS
  $('#liveGraphContainer').highcharts({

    chart: {
      type: 'bubble',
      plotBorderWidth: 1,
      zoomType: 'xy'
    },

    title: {
      text: "=Match Kill On Each Team="
    },

    xAxis: {
      title: {text: 'Team1 kills on Team2'},
      gridLineWidth: 1,
      categories: ['Player1', 'Player2', 'Player3', 'Player4', 'Player5']
    },

    yAxis: {
      title: {text: 'Team2'},
      startOnTick: false,
      endOnTick: false,
      categories: ['Player1', 'Player2', 'Player3', 'Player4', 'Player5']
    },
    series: [{
      name: 'Team1 kills on Team2',
      enableMouseTracking: false,
      data: [
        [1, 2, 5],
        [4,4,1],
        [2,4,2]
      ],
      marker: {
        fillColor: {
          radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
          stops: [
            [0, 'rgba(255,255,255,0.5)'],
            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.5).get('rgba')]
          ]
        }
      }
    }, {
      name: 'Team2 kills on Team1',
      enableMouseTracking: false,
      data: [
        [1, 0, 1],
        [0,0,2]
      ],
      marker: {
        fillColor: {
          radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
          stops: [
            [0, 'rgba(255,255,255,0.5)'],
            [1, Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0.5).get('rgba')]
          ]
        }
      }
    }]

  });

LIVE STATS TAB */

/* STATIC STATS STARTS HERE */
  // CLICKING TABS ON TABLE TO CHANGE DATA
  $(".statTableTabs").on('click',function(){
    var table = $(this)[0].id;
    $("*[data-tableNum=" + table + "]").removeClass('fade').siblings().addClass('fade');

    socket.emit('wantTable', table);

    socket.on('getTable', function(stat){
      console.log('addData');
      addData(stat);
    });
  });
  // backup for the statTableTabs
  // $(".statTableTabs").on('click',function(){
  //   var table = $(this)[0].id;
  //   $("*[data-tableNum=" + table + "]").removeClass('fade').siblings().addClass('fade');
  //
  //   socket.emit('wantTable', table);
  //
  //   socket.on('getTable', function(stat){
  //     console.log('addData');
  //     addData(stat);
  //   });
  // });




  //STATIC GRAPH
  $('#statGraphContainer').highcharts({
    chart: {
        backgroundColor: 'rgba(255,225,225,0.8)',
    },
    title: {
      text: 'Player\'s Rating',
      x: -20 //center
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
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
      name: 'ProStatScore',
      data: [170, 169, 195, 145, 182, 215, 252, 265, 233, 183, 139, 296]
    }, {
      name: 'Most Valuable Player',
      data: [200, 300, 500, 1100, 1700, 1200, 1248, 1241, 1201, 1141, 1806, 1525]
    }]
  });

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



});
