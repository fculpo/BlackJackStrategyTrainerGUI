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
  this.app.boards = {}; // Board ID -> Board instance
  this.app.socketToBoardMap = {}; // Socket ID -> Board ID
  this.app.config = config;

  // debug
  if (server.address()) {
    console.log('BJT started on port %s', server.address().port);
  }
}

BJT.prototype.start = function () {

  console.log("STARTING");
  var self = this;

  // start socket.io server
  this.app.io = io.listen(server);
  this.app.io.set('log level', 2);

  // creates the first board
  var someBoard = new Board(this.app.io);
  this.app.boards[someBoard.uuid] = someBoard;

  this.app.io.sockets.on('connection', function(socket) {

    socket.emit('id', {id: socket.id});

    socket.on('joinTable', function (data) { // data contains Board UUID
      console.log("Jointable received from " + socket.id);

      var theBoard = self.dispatchSocket(socket);

      // Bind the socket to the Board
      self.app.socketToBoardMap[socket.id] = theBoard.uuid;

      theBoard.addPlayer(socket.id, data.pos, function(res) {
        if (res === "ok") {
          theBoard.run();
        }
      });
    });

    socket.on('hit', function() {
      self.app.boards[self.app.socketToBoardMap[socket.id]].checkAction(socket, "hit");
    });

    socket.on('stand', function() {
      self.app.boards[self.app.socketToBoardMap[socket.id]].checkAction(socket, "stand");
    });

    socket.on('double', function() {
      self.app.boards[self.app.socketToBoardMap[socket.id]].checkAction(socket, "double");
    });

    socket.on('split', function() {
      self.app.boards[self.app.socketToBoardMap[socket.id]].checkAction(socket, "split");
    });

    socket.on('surrender-hit', function() {
      self.app.boards[self.app.socketToBoardMap[socket.id]].checkAction(socket, "surrender-hit");
    });

    socket.on('surrender-stand', function() {
      self.app.boards[self.app.socketToBoardMap[socket.id]].checkAction(socket, "surrender-stand");
    });

    socket.on('disconnect', function() {
      console.log("Player " + socket.id + " disconnected");
      self.app.boards[self.app.socketToBoardMap[socket.id]].removePlayer(socket.id);
    });

    socket.on('request-debug', function() {
      var tempBoards = [];
      for (var key in self.app.boards) {
        tempBoards.push(self.app.boards[key].toJSON());
      }
      console.log(tempBoards);
      socket.emit('debug', tempBoards);
      tempBoards.length = 0;
    });

  });
}

BJT.prototype.dispatchSocket = function (socket) {
  // TODO dispatchSocket
  // return Board instance
  var self = this;

  for (var key in this.app.boards) {
    if (this.app.boards.hasOwnProperty(key)) {
      if (this.app.boards[key].players.length < this.app.boards[key].config.howManyPlayersMax) {
        console.log("THERE IS ROOM ON BOARD " + this.app.boards[key].uuid);
        console.log(this.app.boards[key].players.length + "/" + this.app.boards[key].config.howManyPlayersMax + " players");
        return this.app.boards[key];
      } else {
        console.log("THERE IS NO ROOM ON BOARD " + this.app.boards[key].uuid + "!!!!!");
        // Let's create new Board
        var newBoard = new Board(self.app.io);
        this.app.boards[newBoard.uuid] = newBoard;
        return newBoard;
      }
    }
  }

}

module.exports = BJT;