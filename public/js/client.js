 // Client app namespace
var bjt = {}

bjt.socket = io.connect(null, {port: 3000});

bjt.socket.on('id', function(data) {
  bjt.ClientID = data.id;
  console.log("ClientID : " + bjt.ClientID);
});

bjt.socket.on('updateBoard', function(data) {
  console.log(data);
  /*
  $('.dealer .cards .card1').attr('src', data.dealer.cards[0]);
  $('.player .hand1 .card1').attr('src', data.players[0].cards[0]);
  $('.player .hand1 .card2').attr('src', data.players[0].cards[1]);
  */
  console.log("ClientID : " + bjt.ClientID);
});


console.log("client.js started, joining table");

// TEST
bjt.socket.emit('joinTable', { pos: (Math.floor(Math.random() * 6) + 1) });