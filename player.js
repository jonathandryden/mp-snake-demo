'use strict';

module.exports = class Player {
  constructor(userId, userName) {
    this.userId = userId;
    this.userName = userName;
    this.alive = true;
    this.score = 1;
    this.direction = 1;
    this.x = 1;
    this.y = 1;
    this.body = [[1, 1]];
    this.lastX = 1;
    this.lastY = 1;
  }
  move(width, height) {
    let oldLoc = this.body[0].slice();
    let loc = this.body[0].slice();

    switch (this.direction) {
      case 0:
        loc[0]--;
        break;
      case 1:
        loc[1]++;
        break;
      case 2:
        loc[0]++;
        break;
      case 3:
        loc[1]--;
        break;
    }

    // update player origin
    this.body[0] = loc;
    loc = oldLoc.slice(); // store last position of player origin

    // update snake body to last position of prev section
    for (let i = 1; i < this.body.length; i++) {
      oldLoc = this.body[i].slice();
      this.body[i] = loc;
      loc = oldLoc.slice();
    }

    // store last old coords for appending a new section to the body
    this.lastX = oldLoc[0];
    this.lastY = oldLoc[1];

    // collision check for boundaries
    if (this.body[0][0] <= 0 || this.body[0][0] >= width-1 || this.body[0][1] <= 0 || this.body[0][1] >= height-1) {
      this.alive = false;
    }

    // collision check for hitting self
    this.body.forEach((b, index) => {
      if (index > 0) {
        if (this.body[0][0] === b[0] && this.body[0][1] === b[1]) {
          this.alive = false;
        }
      }
    });
  }
}
