'use strict';
var tttapi = tttapi || {};

tttapi.gameWatcher = null;
tttapi.ttt = 'http://ttt.wdibos.com';

tttapi.ajax = function(config, cb) {
    $.ajax(config).done(function(data, textStatus, jqxhr) {
      cb(null, data);
    }).fail(function(jqxhr, status, error) {
      cb({jqxher: jqxhr, status: status, error: error});
    });
  };

tttapi.register = function register(credentials, callback) {
    this.ajax({
      method: 'POST',
      // url: 'http://httpbin.org/post',
      url: this.ttt + '/users',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(credentials),
      dataType: 'json'
    }, callback);
  };

tttapi.login = function login(credentials, callback) {
    this.ajax({
      method: 'POST',
      // url: 'http://httpbin.org/post',
      url: this.ttt + '/login',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(credentials),
      dataType: 'json'
    }, callback);
  };

  //Authenticated api actions
tttapi.listGames = function (token, callback) {
    this.ajax({
      method: 'GET',
      url: this.ttt + '/games',
      headers: {
        Authorization: 'Token token=' + token
      },
      dataType: 'json'
    }, callback);
  };

tttapi.createGame = function (token, callback) {
    this.ajax({
      method: 'POST',
      url: this.ttt + '/games',
      headers: {
        Authorization: 'Token token=' + token
      },
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({}),
      dataType: 'json',
    }, callback);
  };

tttapi.showGame = function (id, token, callback) {
    this.ajax({
      method: 'GET',
      url: this.ttt + '/games/' + id,
      headers: {
        Authorization: 'Token token=' + token
      },
      dataType: 'json'
    }, callback);
  };

tttapi.joinGame = function (id, token, callback) {
    this.ajax({
      method: 'PATCH',
      url: this.ttt + '/games/' + id,
      headers: {
        Authorization: 'Token token=' + token
      },
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({}),
      dataType: 'json'
    }, callback);
  };

tttapi.markCell = function (id, data, token, callback) {
    this.ajax({
      method: 'PATCH',
      url: this.ttt + '/games/' + id,
      headers: {
        Authorization: 'Token token=' + token
      },
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      dataType: 'json'
    }, callback);
  };

tttapi.watchGame = function (id, token) {
    var url = this.ttt + '/games/' + id + '/watch';
    var auth = {
      Authorization: 'Token token=' + token
    };
    this.gameWatcher = resourceWatcher(url, auth); //jshint ignore: line
    return this.gameWatcher;
  };

//$(document).ready(...
$(function() {
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
    };
    tttapi.createGame(token, setGameId);
  });

  $('#show-game').on('submit', function(e) {
    var token = $('.token').val();
    var id = $('#show-id').val();
    e.preventDefault();

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
    };
    tttapi.showGame(id, token, drawBoard);

  });

  $('#join-game').on('submit', function(e) {
    var token = $('.token').val();
    var id = $('#join-id').val();
    e.preventDefault();
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
  });


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
