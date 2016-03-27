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
})
