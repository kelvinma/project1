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


// main game - gets winner
  var grid = ['','','','','','','','',''];

  var getWinner = function(player) {
    var winner;
    // Winner, 0,0, vertical
    if (grid[0] === player && grid[3] === player && grid[6] === player) {
          alert(player + ' Wins!');
          winner = player;
          newGame();

    } // Winner, 0,0, horizontal
    else if (grid[0] === player && grid[1] === player && grid[2] === player) {
          alert(player + ' Wins!');
          winner = player;
          newGame();

    } // Winner, 0,0, diagonal
    else if (grid[0] === player && grid[4] === player && grid[8] === player) {
          alert(player + ' Wins!');
          winner = player;
          newGame();
    } // Winner, 0,1, vertical
    else if (grid[1] === player && grid[4] === player && grid[7] === player) {
          alert(player + ' Wins!');
          winner = player;
          newGame();
    } // Winner, 0,2, vertical
    else if (grid[2] === player && grid[5] === player && grid[8] === player) {
          alert(player + ' Wins!');
          winner = player;
          newGame();
    } // Winner, 0,2, diagonal
    else if (grid[2] === player && grid[4] === player && grid[6] === player) {
          alert(player + ' Wins!');
          winner = player;
          newGame();
    } // Winner, 0,1, vertical
    else if (grid[1] === player && grid[4] === player && grid[7] === player) {
          alert(player + ' Wins!');
          winner = player;
          newGame();
    } // Winner, 1,0, horizontal
    else if (grid[3] === player && grid[4] === player && grid[5] === player) {
          alert(player + ' Wins!');
          winner = player;
          newGame();
      } // Winner, 2,0, horizontal
    else if (grid[6] === player && grid[7] === player && grid[8] === player) {
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
  grid = ['','','','','','','','',''];
  $('.square').html('').addClass('open').removeClass('closed');
  moveCounter = 0;
}

//resets score
  $('#reset').click(function() {
    xScore = 0;
    oScore = 0;
    $('.score').html(xScore);
    newGame();
  });

});
