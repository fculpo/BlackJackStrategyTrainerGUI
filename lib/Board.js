var Player = require('./Player')
  , config = require('./board_config')
  , Deck = require('./Deck');

var Board = function (io) {
  this.config = config;
  this.shoe = Deck(this.config.howManyDecks);
  this.discardShoe = require('./Deck')(0);
  this.players = [];
  this.dealer = new Player(0,0,"dealer");
  this.io = io;
};

Board.prototype.start = function () {
  // BoardLogic.dealHand(this);
}

Board.prototype.addPlayer = function (id, pos, cb) {
  if (this.config.howManyPlayersMax > this.players.length) {
    if ((pos > 0) && (pos <= this.config.howManyPlayersMax)) {
      var freePos = true;
      this.players.forEach(function (player) {
        console.log(player);
        if (player.position === pos) {
          freePos = false;
        }
      });
      if (freePos === true) {
        this.players.push(new Player(id, pos, this.config.startingStack));
        console.log("Successfully added Player " + id + " at position " + pos);
        cb("ok");
      } else {
        console.log("Requested position " + pos + " is already taken !");
      }
    } else {
      console.log("Invalid Position asked ! Max Players = " + this.config.howManyPlayersMax);
    }
  } else {
    console.log("Maximum number of players is reached !");
  }
}

Board.prototype.removePlayer = function (id) {
  for (var i = 0; i < this.players.length; i++) {
    if (this.players[i].id === id) {
      this.players.splice(i,1);
      break;
    }
  }
}

Board.prototype.dispatchPlayer = function (boards) {
  for (var i = 0; i < boards.length; i++) {
    if (this.players.length < this.config.howManyPlayersMax) {
      return this;
    }
  }
  // If all boards are full, creates a new one
  return new Board(this.io);
}

Board.prototype.dealHand = function () {
  for (var i = 0; i < this.players.length; i++) {
    this.players[i].hand.push(this.shoe.deal());
  }

  this.dealer.hand.push(this.shoe.deal());

  for (var i = 0; i < this.players.length; i++) {
    this.players[i].hand.push(this.shoe.deal());
  }
}

Board.prototype.dealHandNoBJ = function () {
  for (var i = 0; i < this.players.length; i++) {
    this.players[i].hand.push(this.shoe.deal());
  }

  this.dealer.hand.push(this.shoe.deal());

  for (var i = 0; i < this.players.length; i++) {
    this.players[i].hand.push(this.shoe.deal());
  }

  for (var i = 0; i < this.players.length; i++) {
    if (player[i].score() === 21) {
      console.log("BJ !!");
      this.discardAll();
      this.dealHandNoBJ();
    }
  }
}

Board.prototype.discardAll = function () {
  for (var i = 0; i < this.players.length; i++) {
    for (var j = 0; j < this.players[i].hand.length; j++) {
      this.discardShoe.addCard(this.players[i].hand.shift());
    }
  }

  for (var h = 0; h < this.dealer.hand.length; h++) {
    this.discardShoe.addCard(this.dealer.hand.shift());
  }
}

Board.prototype.checkAction = function (action) {
  
}

module.exports = Board;