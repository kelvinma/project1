$(document).ready(function(){

  // Zeroes the score for both players
  var xScore = 0;
  var oScore = 0;

  // loads scoreboard
  var checkScore = function(){
    $('#player-score').html(xScore);
    $('#opponent-score').html(oScore);
  }
  checkScore();


  var player = 'X';

  var switchPlayer = function(){
    if (player === 'X') {
          player = 'O';
        } else {
          player = 'X';
        } return player;
    };


// main game - gets winner
  var grid = ['','','','','','','','',''];

  var getWinner = function() {

  }

// click functionality for board
    $('.grid').on('click', '.open', function(){
      $(this).html(player);
      $(this).removeClass('open').addClass('closed');
      grid[$(this).attr('id')] = $(this).attr('id') + player;
      switchPlayer(player);
      notification();
      console.log(grid);
    });

// loads notifications
var notification = function(){
  $('.notifications').html(player + "'s Move");
}


//resets score
  $('#reset').click(function() {
    xScore = 0;
    oScore = 0;
    $('.score').html(xScore);
    var grid = ['','','','','','','','',''];
    $('.square').html('');
  });

});
