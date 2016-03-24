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
    $(this).closest("#navBar").find("[data-mainTab=" + table + "]").fadeIn().siblings().hide();

  });

  $(".prevPage").on('click',function(){
    // get the current width element css
    var currPositionPx = $(this).closest(".slideContainer").css("left").toString();
    var currPosition = Number(currPositionPx.substring(0, currPositionPx.length - 2));
    // calculate the width of the screen
    var winWidthPx = $(this).closest(".page").css("width");
    var winWidth = Number(winWidthPx.substring(0, winWidthPx.length -2));
    //replace the css width element
    var newPostion = currPosition + winWidth;
    $(this).closest(".slideContainer").css('left', newPostion);
  });

  $(".nextPage").on('click',function(){
    // get the current width element css
    var currPositionPx = $(this).closest(".slideContainer").css("left").toString();
    var currPosition = Number(currPositionPx.substring(0, currPositionPx.length - 2));
    // calculate the width of the screen
    var winWidthPx = $(this).closest(".page").css("width");
    var winWidth = Number(winWidthPx.substring(0, winWidthPx.length -2));
    //replace the css width element
    var newPostion = currPosition - winWidth;
    $(this).closest(".slideContainer").css('left', newPostion);
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
    title: {
      text: 'Monthly Average Temperature',
      x: -20 //center
    },
    subtitle: {
      text: 'Source: WorldClimate.com',
      x: -20
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
      title: {
        text: 'Temperature (°C)'
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    tooltip: {
      valueSuffix: '°C'
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      borderWidth: 0
    },
    series: [{
      name: 'Tokyo',
      data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
    }, {
      name: 'New York',
      data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
    }, {
      name: 'Berlin',
      data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
    }, {
      name: 'London',
      data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
    }]
  });

//infinite scroll scoreboard


var options = [
    {selector: '.liveScoreBoard', offset: 50, callback: 'Materialize.toast("This is when we append another table!", 1500 )' }
  ];
  Materialize.scrollFire(options);




});
