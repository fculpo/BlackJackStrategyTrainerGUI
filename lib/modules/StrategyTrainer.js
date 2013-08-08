var StrategyTrainer = function () {

}

StrategyTrainer.prototype.start = function (app) {
  console.log("STRATEGY TRAINER STARTING...");
  this.run(app);
}

StrategyTrainer.prototype.run = function (app) {
  app.board.dealHand();
  console.log(app.board.players[0].hand);

}

module.exports = StrategyTrainer;