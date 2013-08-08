var config = require('../config')
  , server = require('./webserver').server
  , io = require('socket.io')
  , socketHandler = require('./socketHandler')
  , Board = require('./Board');

var app = {};
app.board = new Board();
app.io = io.listen(server);
app.io.set('log level', 2); 

app.io.sockets.on('connection', function(socket) {
  socket.emit('id', {id: socket.id});
  socketHandler(socket, app.board);
});

setInterval(function() {
  console.log(app.board);
}, 5000);