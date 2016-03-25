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

  socket.on('idAssign', function(data) {
    id = data;
  });

  

//when you click on a maintab button it fades in 'this' info and hides all siblings info;
  $(".mainTab").on('click',function(){
    var table = $(this)[0].id;
    var page = $('navBar')
    $(this).css('background-color','grey');
    $(this).closest('li').siblings().find('a').css('background-color','black');
    $(this).closest("#navBar").find("[data-mainTab=" + table + "]").fadeIn().siblings().hide();
  });

/* LIVE STATS TAB
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


});
