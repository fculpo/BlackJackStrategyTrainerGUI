// Deck/Shoe class
var Stack = require('./Stack');

// Creates a n decks shoe
var Deck = function (n) {
  var deck = new Stack();
  deck.fill(n);
  deck.shuffle(5);
  return deck;
}

module.exports = Deck;