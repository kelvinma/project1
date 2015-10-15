var tttapi = tttapi || {};

  // Data placeholder
  var grid = ['','','','','','','','',''];

$(document).ready(function(){

  // Zeroes the score for both players, sets new game notification
  var xScore = 0;
  var oScore = 0;
  $('.notifications').html("New Game: X's Move")

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

  var moveCounter = 0; // moveCounter, tie game at maxed out moves
  // click functionality for board
  $('.grid').on('click', '.open', function(){
      $(this).html(player);
      $(this).removeClass('open').addClass('closed');
      grid[$(this).attr('id')] = player;
      moveCounter++;
      getWinner(player);
      switchPlayer(player);
      notification();
      console.log(grid + ' ' + moveCounter);
    });


  var getWinner = function(player) {
    var winner;
    // Winner, 0,0, vertical
    if ((grid[0] === player && grid[3] === player && grid[6] === player) ||
        (grid[0] === player && grid[1] === player && grid[2] === player) ||
        (grid[0] === player && grid[4] === player && grid[8] === player) ||
        (grid[1] === player && grid[4] === player && grid[7] === player) ||
        (grid[2] === player && grid[5] === player && grid[8] === player) ||
        (grid[2] === player && grid[4] === player && grid[6] === player) ||
        (grid[1] === player && grid[4] === player && grid[7] === player) ||
        (grid[3] === player && grid[4] === player && grid[5] === player) ||
        (grid[6] === player && grid[7] === player && grid[8] === player)) {
          alert(player + ' Wins!');
          winner = player;
          newGame();
    }
    if (winner === 'X') {
      xScore++;
    } else if (winner === 'O') {
      oScore++;
    } else if (moveCounter === 9 && !winner) {
      alert('Tie Game!');
      newGame();
    }
    checkScore();
  };



  // loads notifications
  var notification = function(){
  $('.notifications').html(player + "'s Move");
  }

  var newGame = function(){
    grid = ['','','','','','','','','']; // logic
    $('.square').html('').addClass('open').removeClass('closed'); // ui
    moveCounter = 0; // logic
  }

  //resets score
  $('#reset').click(function() {
    xScore = 0;  // logic
    oScore = 0;  // logic
    $('.score').html(xScore);  // ui
    newGame(); // both??
    $('#session-number').html('')
  });

});
