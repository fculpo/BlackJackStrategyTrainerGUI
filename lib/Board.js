var Player = require('./Player')
  , config = require('./board_config')
  , Deck = require('./Deck')
  , st_map = require('./modules/strategies')["map"]
  , st_euro = require('./modules/strategies')["european"];

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

Board.prototype.dealHandNoBJ = function (socket) {
  var self = this;

  for (var i = 0; i < this.players.length; i++) {
    this.players[i].hand.push(this.shoe.deal());
  }

  this.dealer.hand.push(this.shoe.deal());

  for (var i = 0; i < this.players.length; i++) {
    this.players[i].hand.push(this.shoe.deal());
  }

  for (var i = 0; i < this.players.length; i++) {
    if (this.players[i].score() === 21) {
      console.log("BJ !!");
      this.discardAll();
      this.dealHandNoBJ(socket);
    }
  }

  console.log(this.players[0].hand);
  console.log("SCORE: " + this.players[0].scoreStrategy());

  // stats
  this.players[0].stats.totalRounds++;

  socket.emit('updateBoard', { players : [ { cards: [self.players[0].hand[0].toURL(), self.players[0].hand[1].toURL()] } ], dealer: {cards: [self.dealer.hand[0].toURL()]} } );
}

Board.prototype.discardAll = function () {
  for (var i = 0; i < this.players.length; i++) {
    while (this.players[i].hand.length > 0) {
      this.discardShoe.addCard(this.players[i].hand.shift());
    }
  }

  for (var h = 0; h < this.dealer.hand.length; h++) {
    this.discardShoe.addCard(this.dealer.hand.shift());
  }
}

Board.prototype.checkAction = function (socket, action, cb) {
  var self = this;
  var ans;
  var score = this.players[0].scoreStrategy();
  
  var mapActions = {
    "hit" : "T",
    "stand" : "R",
    "double" : "D",
    "split" : "S",
    "surrender-hit" : "AT",
    "surrender-stand" : "AR"
  };

  var inverseMapActions = {
    "T" : "HIT",
    "R" : "STAND",
    "D" : "DOUBLE",
    "S" : "SPLIT",
    "AT" : "SURRENDER/HIT",
    "AR" : "SURRENDER/STAND"
  }

  var answer = (st_euro[score])[st_map[this.dealer.hand[0].rank]];

  if (mapActions[action] === answer) {
    this.players[0].stats.streak++;
    if (this.players[0].stats.streak > this.players[0].stats.maxStreak) {
      this.players[0].stats.maxStreak = this.players[0].stats.streak;
    }
    this.players[0].stats.wonRounds++;
    ans = "OK";
  } else {
    this.players[0].stats.streak = 0;
    ans = inverseMapActions[answer];
  }

  this.players[0].stats.score = (this.players[0].stats.wonRounds / this.players[0].stats.totalRounds).toFixed(3);
  socket.emit("answer", { "ans": ans,  "score": self.players[0].stats });

  cb();
}

module.exports = Board;