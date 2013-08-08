 // Client app namespace
var bjt = {}

bjt.socket = io.connect(null, {port: 3000});

bjt.socket.on('id', function(data) {
  bjt.ClientID = data.id;
  console.log("ClientID : " + bjt.ClientID);
});

bjt.socket.on('updateBoard', function(data) {
  console.log(data);
  $('#dealer-hand').empty();
  $('#player-hand').empty();
  $('#dealer-hand').append("<div class=\"card " + data.dealer.cards[0] + "\"></div>");
  $('#player-hand').append("<div class=\"card " + data.players[0].cards[0] + "\"></div>");
  $('#player-hand').append("<div class=\"card " + data.players[0].cards[1] + "\"></div>");
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


console.log("client.js started, joining table");

// TEST
bjt.socket.emit('joinTable', { pos: (Math.floor(Math.random() * 6) + 1) });