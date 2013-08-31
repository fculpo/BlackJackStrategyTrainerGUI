"use strict";

// Client app namespace
var bjt = {};


bjt.disableButtons = function() {
  $('#hit-btn').prop('disabled', true);
  $('#stand-btn').prop('disabled', true);
  $('#split-btn').prop('disabled', true);
  $('#double-btn').prop('disabled', true);
  $('#surrender-hit-btn').prop('disabled', true);
  $('#surrender-stand-btn').prop('disabled', true);
}

bjt.enableButtons = function() {
  $('#hit-btn').prop('disabled', false);
  $('#stand-btn').prop('disabled', false);
  $('#split-btn').prop('disabled', false);
  $('#double-btn').prop('disabled', false);
  $('#surrender-hit-btn').prop('disabled', false);
  $('#surrender-stand-btn').prop('disabled', false);
}

bjt.socket = io.connect(window.location.hostname);

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
    //$('#player-score').empty();
    //$('#player-score').append("<h3>" + data.players[0].strategyscore + " / " + data.players[0].score + "</h3>");
    $('#dealer-hand').append("<div class=\"card " + data.dealer.cards[0] + "\"></div>");
    $('#player-hand').append("<div class=\"card " + data.players[0].cards[0] + "\"></div>");
    $('#player-hand').append("<div class=\"card " + data.players[0].cards[1] + "\"></div>");
    $('#board-id').html(data.board);
    bjt.enableButtons();
});

bjt.socket.on('answer', function (data) {
    console.log(data);
    if (data.ans === "OK") {
        $('#answer').append("<span class=\"label label-success\">CORRECT</span>");
    } else {
        $('#answer').append("<span class=\"label label-danger\">WRONG. ANSWER WAS " + data.ans + "</span>");
    }
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

// TEST
//bjt.socket.emit('joinTable', { pos: (Math.floor(Math.random() * 6) + 1) });
bjt.socket.emit('joinTable', { pos: 1 });