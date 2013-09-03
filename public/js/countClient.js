"use strict";

// Client app namespace
var bjt = {};

bjt.socket = io.connect(window.location.hostname);

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

bjt.enableButtons = function () {

}

bjt.socket.on('id', function (data) {
    bjt.ClientID = data.id;
    console.log("ClientID : " + bjt.ClientID);
});

bjt.socket.on('set-board-id', function (data) {
    console.log("ClientID : " + bjt.ClientID);
});

bjt.socket.on('cards', function (data) {
  //TODO dd
});

bjt.socket.on('updateBoard', function (data) {
    //console.log(data);
    $('#cards').empty();
    data.players[0].hand.forEach(function(card) {
      $('#cards').append("<div class=\"card " + card + "\"></div>");
    });
    $('#runningCount').html(data.count);
    $('#board-id').html(data.board);
    //bjt.enableButtons();
});

bjt.socket.on('answer', function (data) {
    console.log(data);
    if (data.res === "OK") {
        $('#answer').append("<span class=\"label label-success\">CORRECT</span>");
    } else {
        $('#answer').append("<span class=\"label label-danger\">WRONG. ANSWER WAS " + data.ans + "</span>");
    }
    bjt.blinkButton(bjt.buttonsToActionMap[data.ans]);
    $('#score-span').html(data.score.score);
    $('#streak-span').html(data.score.streak);
    $('#maxstreak-span').html(data.score.maxStreak);
});

$('#send-btn').click(function () {
    bjt.disableButtons();
    bjt.socket.emit('send-answer');
});

bjt.socket.emit('joinTable', { pos: 1, mode: "count" });