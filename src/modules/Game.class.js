/* eslint-disable no-new-wrappers */
'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */

class Game {
  gameStatus;
  state;
  round = 0;
  rowLength = 4;
  colLength = 4;
  startBlockCount = 2;
  gameScore = 0;

  gameUI = { gameField: null, startButton: null, gameScore: null };
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState, gameUI = {}) {
    if (!initialState) {
      this.state = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
    this.gameUI = gameUI;
    this.initUIEvents();
  }

  showState() {
    this.gameUI.gameScore.textContent = this.gameScore;

    for (let rowIndex = 0; rowIndex < this.rowLength; rowIndex++) {
      for (let colIndex = 0; colIndex < this.colLength; colIndex++) {
        const block =
          this.gameUI.gameField.children[rowIndex].children[colIndex];
        const value = this.state[rowIndex][colIndex];

        if (!value) {
          block.className = 'field-cell';
          block.textContent = '';
          continue;
        }
        block.textContent = value;

        block.className = ['field-cell', 'field-cell--' + value].join(' ');

        if (typeof value === 'object' && value.gameRound === this.round) {
          block.classList.add('box-active');
        } else {
          block.classList.remove('box-active');
        }

        if (typeof value === 'object' && value.newNumber === this.round) {
          block.classList.add('box-new');
        } else {
          block.classList.remove('box-new');
        }
      }
    }
  }

  moveLeft() {
    const acs = false;

    this.sortBlocks(acs);
    this.joinBlocks(acs);
    this.sortBlocks(acs);
    this.addBlock();
    this.showState();
  }

  moveRight() {
    const acs = true;

    this.sortBlocks(acs);
    this.joinBlocks(acs);
    this.sortBlocks(acs);
    this.addBlock();
    this.showState();
  }

  moveUp() {
    const acs = false;

    this.transposeState();
    this.sortBlocks(acs);
    this.joinBlocks(acs);
    this.sortBlocks(acs);
    this.addBlock();
    this.transposeState();
    this.showState();
  }

  moveDown() {
    const acs = true;

    this.transposeState();
    this.sortBlocks(acs);
    this.joinBlocks(acs);
    this.sortBlocks(acs);
    this.addBlock();
    this.transposeState();
    this.showState();
  }

  /**
   * @returns {number}
   */
  getScore() {}

  /**
   * @returns {number[][]}
   */
  getState() {}

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.gameStatus;
  }

  /**
   * Starts the game.
   */
  start() {
    this.gameStatus = Game.STATUS.playing;

    for (let i = 0; i < this.startBlockCount; i++) {
      this.addBlock();
    }

    this.showState();
  }

  initUIEvents() {
    this.gameUI.startButton.addEventListener('click', (e) => {
      this.gameUI.startButton.textContent = 'Restart';
      this.gameUI.startButton.classList.remove('start');
      this.gameUI.startButton.classList.add('restart');
      this.start();
    });

    document.addEventListener('keydown', this.moveKeyHandler);
  }

  moveKeyHandler = (e) => {
    if (
      !(e.key && e.key in Game.moveKeys) ||
      this.getStatus() !== Game.STATUS.playing
    ) {
      return;
    }

    document.activeElement.blur();
    document.body.focus();

    e.preventDefault();

    switch (e.key) {
      case Game.moveKeys.ArrowLeft:
        this.moveLeft();
        break;
      case Game.moveKeys.ArrowRight:
        this.moveRight();
        break;
      case Game.moveKeys.ArrowUp:
        this.moveUp();
        break;
      case Game.moveKeys.ArrowDown:
        this.moveDown();
        break;
    }
  };

  /**
   * Resets the game.
   */
  restart() {}

  addBlock = () => {
    const freeRows = [];

    for (const stateRow in this.state) {
      if (this.state[stateRow].some((block) => block === 0)) {
        freeRows.push(stateRow);
      }
    }

    const freeRow =
      freeRows.length === 1
        ? freeRows[0]
        : Math.floor(Math.random() * freeRows.length);

    const row = this.state[freeRow];
    const freeSpace = row.filter((num) => num === 0).length;

    if (freeSpace) {
      const blockPosition =
        freeSpace === 0 ? 1 : Math.floor(Math.random() * freeSpace);
      let freeIndex = 0;

      for (const index in row) {
        if (row[index]) {
          continue;
        }

        if (freeIndex === blockPosition) {
          row[index] = this.newBlockValue();
          row[index].newNumber = this.round;
          break;
        }
        freeIndex++;
      }
    }
  };

  sortBlocks = (acs = true) => {
    const sortAsc = (a, b) => Boolean(a) * 1 - Boolean(b) * 1;
    const sortDesc = (a, b) => Boolean(b) * 1 - Boolean(a) * 1;

    for (const row of this.state) {
      if (acs) {
        row.sort(sortAsc);
      } else {
        row.sort(sortDesc);
      }
    }
  };

  joinBlocks = (acs = true) => {
    for (const row of this.state) {
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i]) {
          if (Number(row[i]) === Number(row[i + 1])) {
            if (acs) {
              row[i] = 0;
              row[i + 1] = new Number(row[i + 1] * 2);
              this.gameScore += row[i + 1];
              row[i + 1].gameRound = this.round;
            } else {
              row[i] = new Number(row[i] * 2);
              this.gameScore += row[i];
              row[i].gameRound = this.round;
              row[i + 1] = 0;
            }
            i++;
          }
        }
      }
    }
  };

  newBlockValue() {
    const value = Math.random() < 0.8 ? 2 : 4;

    return new Number(value);
  }

  transposeState() {
    const newState = [];

    for (let col = 0; col < this.colLength; col++) {
      const newRow = [];

      newState.push(newRow);

      for (let row = 0; row < this.rowLength; row++) {
        newRow.push(this.state[row][col]);
      }
    }
    this.state = newState;
    [this.rowLength, this.colLength] = [this.colLength, this.rowLength];
    this.isTranspose = !this.isTranspose;
  }
}

Game.STATUS = {
  idle: 'idle',
  playing: 'playing',
  win: 'win',
  lose: 'lose',
};

Game.moveKeys = {
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
};

module.exports = Game;
