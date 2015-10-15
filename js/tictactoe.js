var tttapi = tttapi || {};

  // Data placeholder
  var grid = ['','','','','','','','',''];

$(document).ready(function(){

  $('.board').hide();
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
    $('.board').hide('slow');
  });

// API Stuff

  // takes form element's children's attributes and creates 'data' object
  // used in register login functions
  var form2object = function(form) {
    var data = {};
    $(form).children().each(function(index, element) {
      var type = $(this).attr('type');
      if ($(this).attr('name') && type !== 'submit' && type !== 'hidden') {
        data[$(this).attr('name')] = $(this).val();
      }
    });
    return data;
  };

  // builds {<root> : formData} (root is a string)
  var wrap = function wrap(root, formData) {
    var wrapper = {};
    wrapper[root] = formData;
    return wrapper;
  };

// refactor this to work with game board
  var callback = function callback(error, data) {
    if (error) {
      console.error(error);
      $('#result').val('status: ' + error.status + ', error: ' +error.error);
      return;
    }
    $('#result').val(JSON.stringify(data, null, 4));
  };


  $('#register').on('submit', function(e) {
    var credentials = wrap('credentials', form2object(this));
    tttapi.register(credentials, callback);
    e.preventDefault();
  });

  $('#login').on('submit', function(e) {
    var credentials = wrap('credentials', form2object(this));
    var cb = function cb(error, data) { // data is object with propertiy user with object with property token
                                        // data is passed back from server
      if (error) {
        alert('Log-error');
        return;
      }
      callback(null, data);
      $('.token').val(data.user.token); // sets .token as data.user.token
      alert('Successfully logged in!');
    };
    e.preventDefault();
    tttapi.login(credentials, cb);
  });


// LOOK AT THE HTML
  $('#list-games').on('submit', function(e) {
    var token = $('.token').val(); // retrieves token from hidden value
    e.preventDefault();
    tttapi.listGames(token, callback); // passes token as first argument
  });

  $('#create-game').on('submit', function(e) {
    var token = $(this).children('[name="token"]').val();
    e.preventDefault();
    var setGameId = function(error, data){
      if (error) {
        alert('Cannot create game');
        return;
      }
      $('.grid').data('game-id', data.game.id);
      $('#session-number').html($('.grid').data('game-id'));
      $('.board').show('slow');
    };
    tttapi.createGame(token, setGameId);
  });

  $('#show-game').on('submit', function(e) {
    var token = $('.token').val();
    var id = $('#show-id').val();
    e.preventDefault();
    newGame();
    var drawBoard = function (error, data){
      if (error) {
        alert('Saved session does not exist!');
        return;
      }
      var saveState = data.game.cells;
      for (var i = 0; i < grid.length; i++) {
        grid[i] = saveState[i];
        var square = '#'+i;
        $(square).html(grid[i]);
        $('.grid').data('game-id', data.game.id);
        $('#session-number').html($('.grid').data('game-id'))
        $('.board').show('slow');
      }
    };
    tttapi.showGame(id, token, drawBoard);

  });

  $('#join-game').on('submit', function(e) {
    var token = $('.token').val();
    var id = $('#join-id').val();
    e.preventDefault();
    newGame();
    var drawBoard = function (error, data){
      if (error) {
        alert('Saved session does not exist!');
        return;
      }
      var saveState = data.game.cells;
      for (var i = 0; i < grid.length; i++) {
        grid[i] = saveState[i];
        var square = '#'+i;
        $(square).html(grid[i]);
        $('.grid').data('game-id', data.game.id);
        $('#session-number').html($('.grid').data('game-id'))
      }

    tttapi.joinGame(id, token, drawBoard);
  };


  $('.grid').on('click', '.open', function() {
    var token = $('.token').val(); // sets value of var token to class .token
    var id = $('.grid').data('game-id');
    var index = $(this).attr('id'); // sets index
    var value = $(this).html(); // sets 'X' or 'O'
    var data = wrap('game', wrap('cell', {index: index, value: value})); // passes object with index and value
    // e.preventDefault();
    tttapi.markCell(id, data, token, callback);
  });


  $('#watch-game').on('submit', function(e){
    var token = $(this).children('[name="token"]').val();
    var id = $('#watch-id').val();
    e.preventDefault();

    var gameWatcher = tttapi.watchGame(id, token);

    gameWatcher.on('change', function(data){
      var parsedData = JSON.parse(data);
      if (data.timeout) { //not an error
        this.gameWatcher.close();
        return console.warn(data.timeout);
      }
      var gameData = parsedData.game;
      var cell = gameData.cell;
      $('#watch-index').val(cell.index);
      $('#watch-value').val(cell.value);
    });
    gameWatcher.on('error', function(e){
      console.error('an error has occured with the stream', e);
    });
  });

  });





});
