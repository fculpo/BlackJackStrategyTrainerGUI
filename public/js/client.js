"use strict";

// Client app namespace
var bjt = {};

bjt.buttonsToActionMap = {
  "SURRENDER": $('#surrender-btn'),
  "HIT": $('#hit-btn'),
  "STAND": $('#stand-btn'),
  "SPLIT": $('#split-btn'),
  "DOUBLE": $('#double-btn')
}

bjt.blinkButton = function (button) {
  button.removeClass().addClass("btn btn-success");
  setTimeout(function() {
    button.removeClass().addClass("btn btn-default");
    setTimeout(function() {
      button.removeClass().addClass("btn btn-success");
      setTimeout(function() {
        button.removeClass().addClass("btn btn-default");
        setTimeout(function() {
          button.removeClass().addClass("btn btn-success");
        }, 150);
      }, 150);
    }, 150);
  }, 150);
}

bjt.disableButtons = function() {
  $('#hit-btn').prop('disabled', true);
  $('#hit-btn').removeClass().addClass("btn btn-default");
  $('#stand-btn').prop('disabled', true);
  $('#stand-btn').removeClass().addClass("btn btn-default");
  $('#split-btn').prop('disabled', true);
  $('#split-btn').removeClass().addClass("btn btn-default");
  $('#double-btn').prop('disabled', true);
  $('#double-btn').removeClass().addClass("btn btn-default");
  $('#surrender-btn').prop('disabled', true);
  $('#surrender-btn').removeClass().addClass("btn btn-default");
}

bjt.enableButtons = function() {
  $('#hit-btn').prop('disabled', false);
  $('#hit-btn').removeClass().addClass("btn btn-primary");
  $('#stand-btn').prop('disabled', false);
  $('#stand-btn').removeClass().addClass("btn btn-danger");
  $('#split-btn').prop('disabled', false);
  $('#split-btn').removeClass().addClass("btn btn-warning");
  $('#double-btn').prop('disabled', false);
  $('#double-btn').removeClass().addClass("btn btn-info");
  $('#surrender-btn').prop('disabled', false);
  $('#surrender-btn').removeClass().addClass("btn btn-default");
}

bjt.socket = io.connect(window.location.hostname, {'sync disconnect on unload' : true});

bjt.socket.on('id', function (data) {
    bjt.ClientID = data.id;
    console.log("ClientID : " + bjt.ClientID);
});

bjt.socket.on('set-board-id', function (data) {
    console.log("ClientID : " + bjt.ClientID);
});

bjt.socket.on('updateBoard', function (data) {
    //console.log(data);
    $('#answer').empty();
    $('#dealer-hand').empty();
    $('#player-hand').empty();
    $('#dealer-hand').append("<div class=\"card " + data.dealer.cards[0] + "\"></div>");
    $('#player-hand').append("<div class=\"card " + data.players[0].cards[0] + "\"></div>");
    $('#player-hand').append("<div class=\"card " + data.players[0].cards[1] + "\"></div>");
    $('#board-id').html(data.board);
    bjt.enableButtons();
});

bjt.socket.on('answer', function (data) {
    console.log(data);
    if (data.res === "OK") {
        $('#answer').append("<span class=\"label label-success\">CORRECT</span>");
    } else {
        $('#answer').append("<span class=\"label label-danger\">WRONG. ANSWER WAS " + data.ans + "</span>");
    }
    //bjt.buttonsToActionMap[data.ans].removeClass().addClass("btn btn-success");
    bjt.blinkButton(bjt.buttonsToActionMap[data.ans]);
    $('#score-span').html(data.score.score);
    $('#streak-span').html(data.score.streak);
    $('#maxstreak-span').html(data.score.maxStreak);
});

$('#hit-btn').click(function () {
    bjt.disableButtons();
    bjt.socket.emit('hit');
});

$('#stand-btn').click(function () {
    bjt.disableButtons();
    bjt.socket.emit('stand');
});

$('#split-btn').click(function () {
    bjt.disableButtons();
    bjt.socket.emit('split');
});

$('#double-btn').click(function () {
    bjt.disableButtons();
    bjt.socket.emit('double');
});

$('#surrender-btn').click(function () {
    bjt.disableButtons();
    bjt.socket.emit('surrender');
});

console.log("client.js started, joining table");

//bjt.socket.emit('joinTable', { pos: (Math.floor(Math.random() * 6) + 1) });
bjt.socket.emit('joinTable', { pos: 1 });