'use strict';

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const Player = require('./player.js');
const Game = require('./game.js');
const game = new Game();

app.get('/', (req, res) => {
  res.sendfile('./index.html');
});
http.listen(80);

io.on('connection', (socket) => {
  // match id
  socket.emit('connected', socket.id);

  // init player
  socket.on('joinGame', (userName) => {
    console.log(`${userName} has joined the game`);
    game.players.push(new Player(socket.id, userName));
  });

  // handle player controls
  socket.on('changeDirection', (direction) => {
    let index = game.players.map((p) => p.userId).indexOf(socket.id);
    let playerDir = game.players[index].direction;
    if ((direction === 0 && playerDir != 2) || (direction === 1 && playerDir != 3) || (direction === 2 && playerDir != 0) || (direction === 3 && playerDir != 1)) {
      game.players[index].direction = direction;
    }
  });

  // remove player on dc
  socket.on('disconnect', () => {
    console.log('a player has left the game');
    let index = game.players.map((p) => p.userId).indexOf(socket.id);
    game.players.splice(index, 1);
  });

  // respawn player if dead
  socket.on('replay', (p) => {
    if (!p.alive) {
      let index = game.players.map((p) => p.userId).indexOf(p.id);
      game.players[index] = new Player(p.id, p.userName);
    }
  });
});

// start game
gameLoop();

function gameLoop() {
  game.updatePlayers();
  game.spawnBlocks();

  io.sockets.emit('update', game);
  setTimeout(gameLoop, 350);
}
