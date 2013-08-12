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
      console.log("Jointable received from " + socket.id);
      self.app.board.addPlayer(socket.id, data.pos, function(res) {
        if (res === "ok") {
          self.run(socket);
        }
      });
    });

    socket.on('hit', function() {
      self.app.board.checkAction(socket, "hit", function() {
        self.timer(socket);
      });
    });

    socket.on('stand', function() {
      self.app.board.checkAction(socket, "stand", function() {
        self.timer(socket);
      });
    });

    socket.on('double', function() {
      self.app.board.checkAction(socket, "double", function() {
        self.timer(socket);
      });
    });

    socket.on('split', function() {
      self.app.board.checkAction(socket, "split", function() {
        self.timer(socket);
      });
    });

    socket.on('surrender-hit', function() {
      self.app.board.checkAction(socket, "surrender-hit", function() {
        self.timer(socket);
      });
    });

    socket.on('surrender-stand', function() {
      self.app.board.checkAction(socket, "surrender-stand", function() {
        self.timer(socket);
      });
    });


    socket.on('disconnect', function() {
      console.log("Player " + socket.id + " disconnected");
      self.app.board.removePlayer(socket.id);
    });

  });
}

BJT.prototype.timer = function (sock) {
  var self = this;
  setTimeout(function() {
    self.run(sock);
  }, 2000);
}

BJT.prototype.run = function(sock) {
  var self = this;
  this.app.board.discardAll();
  this.app.board.dealHandNoBJ(sock);
}

module.exports = BJT;