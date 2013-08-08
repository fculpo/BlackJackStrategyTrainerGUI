/**
 * BJT Main
 */

var config = require('../config')
  , server = require('./webserver').server
  , io = require('socket.io')
  , Board = require('./Board');


// Prevent crashes
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err + '\n' + err.stack);
});

var BJT = function() {
  // setup namespace
  this.app = {};
  this.app.clients = [];
  this.app.config = config;
  // debug
  if (server.address()) {
    console.log('BJT started on port %s', server.address().port);
  } 
}


BJT.prototype.start = function () {

  console.log("STARTING");
  var self = this;

  // builds the table
  this.app.board = new Board(this.app.io);

  // start socket.io server
  this.app.io = io.listen(server);
  this.app.io.set('log level', 2);

  this.app.io.sockets.on('connection', function(socket) {
    self.app.clients.push(socket.id);
    socket.emit('id', {id: socket.id});

    socket.on('joinTable', function (data) {
      console.log("jointable received from " + socket.id);
      self.app.board.addPlayer(socket.id, data.pos, function(res) {
        if (res === "ok") {
          self.run(socket.id);
        }
      });
    });

    socket.on('disconnect', function() {
      console.log("Player " + socket.id + " disconnected");
      self.app.board.removePlayer(socket.id);
    });

  });
}

BJT.prototype.run = function(id) {
  var self = this;
  this.app.board.dealHand();
  this.app.io.sockets.socket(id).emit('updateBoard', { players : [ { cards: [this.app.board.players[0].hand[0].toURL(), this.app.board.players[0].hand[1].toURL()] } ], dealer: {cards: [this.app.board.dealer.hand[0].toURL()]} } );
  this.app.board.discardAll();
  setTimeout(function() {
    self.run();
  }, 5000);
}

module.exports = BJT;