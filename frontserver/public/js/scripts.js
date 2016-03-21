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


  $('#container').highcharts({

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



});

