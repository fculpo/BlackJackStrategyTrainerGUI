 // Client app namespace
var bjt = {}

bjt.socket = io.connect(null, {port: 3000});

bjt.socket.on('id', function(data) {
  bjt.ClientID = data.id;
  console.log("ClientID : " + bjt.ClientID);
});

bjt.socket.on('updateBoard', function(data) {
  //console.log(data);
  $('#answer').empty();
  $('#dealer-hand').empty();
  $('#player-hand').empty();
  $('#dealer-hand').append("<div class=\"card " + data.dealer.cards[0] + "\"></div>");
  $('#player-hand').append("<div class=\"card " + data.players[0].cards[0] + "\"></div>");
  $('#player-hand').append("<div class=\"card " + data.players[0].cards[1] + "\"></div>");
});

bjt.socket.on('answer', function(data) {
  console.log(data);
  if (data["ans"] === "OK") {
    $('#answer').append("<span class=\"label label-success\">CORRECT</span>");
  } else {
    $('#answer').append("<span class=\"label label-danger\">WRONG. ANSWER WAS " + data["ans"] + "</span>");
  }
  $('#score-span').html(data["score"].score);
  $('#streak-span').html(data["score"].streak);
  $('#maxstreak-span').html(data["score"].maxStreak);
});

$('#hit-btn').click(function() {
  bjt.socket.emit('hit');
});

$('#stand-btn').click(function() {
  bjt.socket.emit('stand');
});

$('#split-btn').click(function() {
  bjt.socket.emit('split');
});

$('#double-btn').click(function() {
  bjt.socket.emit('double');
});

$('#surrender-hit-btn').click(function() {
  bjt.socket.emit('surrender-hit');
});

$('#surrender-stand-btn').click(function() {
  bjt.socket.emit('surrender-stand');
});

console.log("client.js started, joining table");

// TEST
bjt.socket.emit('joinTable', { pos: (Math.floor(Math.random() * 6) + 1) });