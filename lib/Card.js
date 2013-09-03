var Card = function (rank, suit) {
	this.rank = rank;
	this.suit = suit;
}

Card.prototype.toURL = function () {
  return "rank" + this.rank + this.suit;
}

Card.prototype.toString = function () {
	var rank, suit;

  switch (this.rank) {
    case "A" : rank = "Ace"; break;
    case "2" : rank = "Two"; break;
    case "3" : rank = "Three"; break;
    case "4" : rank = "Four"; break;
    case "5" : rank = "Five"; break;
    case "6" : rank = "Six"; break;
    case "7" : rank = "Seven"; break;
    case "8" : rank = "Eight"; break;
    case "9" : rank = "Nine"; break;
    case "10" : rank = "Ten"; break;
    case "J" : rank = "Jack"; break;
    case "Q" : rank = "Queen"; break;
    case "K" : rank = "King"; break;
    default : rank = null; break;
  }

  switch (this.suit) {
    case "C" : suit = "Clubs"; break;
    case "D" : suit = "Diamonds"; break;
    case "H" : suit = "Hearts"; break;
    case "S" : suit = "Spades"; break;
    default :  suit = null; break;
  }

  if (rank == null || suit == null)
    return "";

  return rank + " of " + suit;
}

Card.prototype.pointCount = function () {
  var value;

  switch (this.rank) {
    case "A" : value = -1; break;
    case "2" : value = 1; break;
    case "3" : value = 1; break;
    case "4" : value = 1; break;
    case "5" : value = 1; break;
    case "6" : value = 1; break;
    case "7" : value = 0; break;
    case "8" : value = 0; break;
    case "9" : value = 0; break;
    case "10" : value = -1; break;
    case "J" : value = -1; break;
    case "Q" : value = -1; break;
    case "K" : value = -1; break;
    default : value = 0; break;
  }

  return value;
}

module.exports = Card;