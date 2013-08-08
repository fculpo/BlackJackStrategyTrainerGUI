var readline = require('readline')
  , strategies = require('./strategies');

// Terminal colors
var red = '\u001b[91m'
  , green = '\u001b[92m'
  , yellow = '\u001b[93m'
  , pink = '\u001b[95m'
  , blue = '\u001b[96m'
  , reset = '\u001b[0m';


var StrategyTrainerCLI = function () {
  this.rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  // May not be necessary
  this.rl.pause();
}

StrategyTrainerCLI.prototype.random = function () {
  return [(Math.floor(Math.random() * 36) + 2),(Math.floor(Math.random() * 10) + 2)];
}

StrategyTrainerCLI.prototype.stats = {
  score: 0,
  streak: 0,
  maxStreak: 0,
  wonRounds: 0,
  totalRounds: 0
};

StrategyTrainerCLI.prototype.display = function(rand) {
  return "[ " + blue + this.strategy.get([rand[0], 1]) + reset + " vs " + pink + this.strategy.get([1,rand[1]]) + reset + " ]\n"
}

// A step of the engineCLI, recursively calls itself
StrategyTrainerCLI.prototype.run = function() {
  var rand, answer;
  var instance = this;

  rand = this.random();
  answer = this.strategy.get(rand);
  instance.stats.totalRounds += 1;
 
  instance.rl.question(this.display(rand), function(res) {
    if ((res === "exit") || (res === "q")) {
      process.exit(0);
    }
    if (res.toUpperCase() === answer) {
      console.log(green + "TRUE" + reset);
      instance.stats.streak++;
      if (instance.stats.streak > instance.stats.maxStreak) {
        instance.stats.maxStreak = instance.stats.streak;
      }
      instance.stats.wonRounds++;
    } else {
      console.log(red + "FALSE" + reset + " -> ANSWER : " + yellow + answer + reset);
      instance.stats.streak = 0;
    }
    instance.rl.pause();
    instance.updateScore();
    // Display current score
    console.log(yellow + "Current score : " + reset + instance.stats.score + yellow + "  Current streak : " + reset + instance.stats.streak + yellow + "  Max Streak : " + reset + instance.stats.maxStreak + "\n");
    instance.run(); //continue until "exit"
  });  
}

StrategyTrainerCLI.prototype.updateScore = function () {
  var instance = this;
  instance.stats.score = (instance.stats.wonRounds / instance.stats.totalRounds).toFixed(3);
}

StrategyTrainerCLI.prototype.start = function () {
  var instance = this;
  instance.strategy = strategies.european;

  console.log("\033[2J\033[0f");
  console.log(yellow + "Type exit or q to quit" + reset + "\n");
  
  instance.run();
}

module.exports = StrategyTrainerCLI;