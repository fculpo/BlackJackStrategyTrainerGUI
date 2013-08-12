 // Client app namespace
var bjt = {}

bjt.socket = io.connect(null, {port: 3000});

bjt.socket.on('id', function(data) {
  bjt.ClientID = data.id;
  console.log("ClientID : " + bjt.ClientID);
});

bjt.socket.on('updateBoard', function(data) {
  console.log("updateBoard received");
  console.log(data);
  $('#answer').empty();
  $('#dealer-hand').empty();
  $('#player-hand').empty();
  $('#dealer-hand').append("<div class=\"card " + data.dealer.cards[0] + "\"></div>");
  $('#player-hand').append("<div class=\"card " + data.players[0].cards[0] + "\"></div>");
  $('#player-hand').append("<div class=\"card " + data.players[0].cards[1] + "\"></div>");
});

bjt.socket.on('actionOK', function(data) {
  $('#answer').append("<span class=\"label label-success\">CORRECT</span>");
});

bjt.socket.on('actionKO', function(data) {
  $('#answer').append("<span class=\"label label-danger\">WRONG. ANSWER WAS " + data["ans"] + "</span>");
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

$('#surrender-btn').click(function() {
  bjt.socket.emit('surrender');
});


console.log("client.js started, joining table");

// TEST
bjt.socket.emit('joinTable', { pos: (Math.floor(Math.random() * 6) + 1) });