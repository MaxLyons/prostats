$(function() {
  //counter to see what page you're on.
  var current_tab = 'initial pageload';

  var id = "";
  var socket = io();
  socket.on('connectedUsers', function(data) {
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
    var table = $(this)[0].id;
    var page = $('navBar');
    $(this).closest("#navBar").find("[data-mainTab=" + table + "]").fadeIn().siblings().hide();
    current_tab = table;
    console.log(current_tab);
    // remove the appended tables on live_tab if you move away to another page
    if(current_tab != "mainLiveTab"){
      $('.container_data').remove();
    }
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

/*LIVE STATS TAB */

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

//global variable to stop appending after the last 10 games
var counter = 0;

$(window).scroll(function () {
   if (current_tab == "mainLiveTab" && $(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
      console.log($(window).scrollTop());//Add something at the end of the page

    if(counter < 10){
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



});
