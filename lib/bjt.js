/**
 * BJT Main
 */

var config = require('../config')
  , server = require('./webserver').server
  , io = require('socket.io')
  , Board = require('./Board')
  , logger = require('./logs');

// Prevent crashes
process.on('uncaughtException', function(err) {
  logger.log('Caught exception: ' + err + '\n' + err.stack);
});

var BJT = function() {
  // setup namespace
  this.app = {};
  this.app.boards = {}; // Board ID -> Board instance
  this.app.socketToBoardMap = {}; // Socket ID -> Board ID
  this.app.config = config;

  // debug
  if (server.address()) {
    logger.info('BJT started on port %s', server.address().port);
  }
}

BJT.prototype.start = function () {

  logger.info("STARTING");
  var self = this;

  // start socket.io server
  this.app.io = io.listen(server);

  // creates the first board
  var someBoard = new Board(this.app.io);
  this.app.boards[someBoard.uuid] = someBoard;

  this.app.io.sockets.on('connection', function(socket) {

    socket.emit('id', {id: socket.id});

    socket.on('joinTable', function (data) { // data contains Board UUID
      logger.info("Jointable received from " + socket.id);

      var theBoard = self.dispatchSocket(socket);

      // Bind the socket to the Board
      self.app.socketToBoardMap[socket.id] = theBoard.uuid;

      theBoard.addPlayer(socket.id, data.pos, function(res) {
        if (res === "ok") {
          socket.emit('set-board-id', { boardID : theBoard.uuid });
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

    socket.on('surrender', function() {
      self.app.boards[self.app.socketToBoardMap[socket.id]].checkAction(socket, "surrender");
    });

    socket.on('disconnect', function() {
      logger.info("Player " + socket.id + " disconnected");
      if (typeof self.app.boards[self.app.socketToBoardMap[socket.id]] !== "undefined") {
        var boardID = self.app.socketToBoardMap[socket.id];
        self.app.boards[boardID].removePlayer(socket.id);
        // delete socket -> Board map
        delete self.app.socketToBoardMap[socket.id];
        //Remove Board
        if (self.app.boards[boardID].playersNb === 0) {
          delete self.app.boards[boardID];
        }
      }
    });

    socket.on('request-debug', function() {
      var tempBoards = [];
      for (var key in self.app.boards) {
        tempBoards.push(self.app.boards[key].toJSON());
      }
      socket.emit('debug', tempBoards);
      tempBoards.length = 0;
    });

  });
}

BJT.prototype.dispatchSocket = function (socket) {
  // TODO dispatchSocket
  // return Board instance
  var self = this;
  var isRoom = false;

  for (var key in this.app.boards) {
    if (this.app.boards.hasOwnProperty(key)) {
      if (this.app.boards[key].playersNb < this.app.boards[key].config.howManyPlayersMax) {
        var seats = this.app.boards[key].config.howManyPlayersMax - this.app.boards[key].playersNb;
        logger.info("=> " + this.app.boards[key].uuid + " (" + seats + " seats available)" );
        //logger.info(this.app.boards[key].playersNb + "/" + this.app.boards[key].config.howManyPlayersMax + " players");
        return this.app.boards[key];
      }
    }
  }

  if (isRoom === false) {
    // Let's create new Board
    var newBoard = new Board(self.app.io);
    this.app.boards[newBoard.uuid] = newBoard;
    return newBoard;
  }

}

module.exports = BJT;