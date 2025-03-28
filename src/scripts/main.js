'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');

const game = new Game(null, {
  gameField: document.querySelector('.game-field tbody'),
  startButton: document.querySelector('button.start'),
  gameScore: document.querySelector('.game-score'),
});

// Write your code here
