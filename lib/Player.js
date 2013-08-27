// Player object

var Player = function (id, pos, stack) {
    this.id = id;
    this.position = pos;
    this.hand = [];
    if (stack === "dealer") {
      this.isDealer = true;
      this.stack = "unlimited";
    } else {
      this.isDealer = false;
      this.stack = stack;
    }
    this.bet = 0;
    this.stand = false;
    this.sitOut = false;
    this.stats = {
      score: 0,
      streak: 0,
      maxStreak: 0,
      wonRounds: 0,
      totalRounds: 0
    };
}

Player.prototype.score = function () {
  var aces_count = 0, score = 0;
  var card;
  for (var i = 0; i < this.hand.length; i++) {
    card = this.hand[i].rank;
    if (card == "A") {
      aces_count += 1;
      score += 11;
    } else if (card == "K" || card == "Q" || card == "J") {
      score += 10;
    } else {
      score += parseInt(card);
    }
  }
  while (score > 21 && aces_count > 0) {
    score -= 10;
    aces_count -= 1;
  }
  return score;
}

Player.prototype.scoreStrategy = function () {
  var aces_count = 0, score = 0;

  if (this.hand[0].rank === this.hand[1].rank) {
    if ((this.hand[0].rank === "J") || (this.hand[0].rank === "Q") || (this.hand[0].rank === "K")) {
      return "D10";
    }
    return "D" + this.hand[0].rank;
  }

  var card;
  for (var i = 0; i < this.hand.length; i++) {
    card = this.hand[i].rank;
    if (card == "A") {
      aces_count += 1;
      score += 11;
    } else if (card == "K" || card == "Q" || card == "J") {
      score += 10;
    } else {
      score += parseInt(card);
    }
  }

  while (score > 21 && aces_count > 0) {
    score -= 10;
    aces_count -= 1;
  }

  if (aces_count > 0) {
    return "S" + score;
  } else {
    return score.toString();
  }
}

Player.prototype.is_busted = function () {
    return this.score() > 21;
}

module.exports = Player;