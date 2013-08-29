var Card = require('./Card');

var Stack = function () {
  this.cards = [];
}

Stack.prototype.empty = function () {
  this.cards = [];
}

Stack.prototype.fill = function(n) {
  var ranks = new Array("A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K");
  var suits = new Array("C", "D", "H", "S");
  var i, j, k;
  var m;

  m = ranks.length * suits.length;

  // Set array of cards.
  this.cards = new Array(n * m);
  this.totalCardsNb = n * m;

  // Fill the array with 'n' packs of cards.
  for (i = 0; i < n; i++)
    for (j = 0; j < suits.length; j++)
      for (k = 0; k < ranks.length; k++)
        this.cards[i * m + j * ranks.length + k] = new Card(ranks[k], suits[j]);
}

// shuffles the deck n times
Stack.prototype.shuffle = function(n) {
  var i, j, k;
  var temp;

  for (i = 0; i < n; i++) {
    for (j = 0; j < this.cards.length; j++) {
      k = Math.floor(Math.random() * this.cards.length);
      temp = this.cards[j];
      this.cards[j] = this.cards[k];
      this.cards[k] = temp;
    }
  }
}

Stack.prototype.deal = function() {
  if (this.cards.length > 0) {
    return this.cards.shift();
  } else {
    return null;
  }
}

Stack.prototype.draw = function(n) {
  var card;
  if (n >= 0 && n < this.cards.length) {
    card = this.cards[n];
    this.cards.splice(n,1);
  } else {
    card = null;
  }
  return card;
}

Stack.prototype.cardCount = function() {
  return this.cards.length;
}

Stack.prototype.addCard = function(card) {
  this.cards.push(card);
}

Stack.prototype.combine = function(stack) {
  this.cards = this.cards.concat(stack.cards);
  stack.length = 0;
}

module.exports = Stack;