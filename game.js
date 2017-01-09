'use strict';

function randomCoord(min, max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

module.exports = class Game {
  constructor() {
    this.players = [];
    this.blocks = [];
    this.height = 40;
    this.width = 20;
    this.highestScore = {name: '', score: 0};
  }
  updatePlayers() {
    this.players.forEach((p) => {
      if (p.score >= this.highestScore.score) {
        this.highestScore = {name: p.userName, score: p.score};
      }

      if (p.alive){
        p.move(this.width, this.height);
      }

      // collision for score
      let removable = [];
      this.blocks.forEach((b, i) => {
        if (p.body[0][0] === b[0] && p.body[0][1] === b[1]) {
          removable.push(i);
          p.score++;
          p.body.push([p.lastX, p.lastY]);
        }
      });
      removable.forEach((i) => {
        this.blocks.splice(i, 1);
      });
    });
  }
  spawnBlocks() {
    if (this.blocks.length <= 10 && randomCoord(1, 100) >= 50) {
      let newBlock = [randomCoord(this.width-1, 1), randomCoord(this.height-1, 1)];
      this.blocks.push(newBlock);
    }
  }
}
