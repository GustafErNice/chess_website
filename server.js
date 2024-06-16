const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { Chess } = require('chess.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    const chess = new Chess();

    socket.on('move', (move) => {
        if (chess.move(move)) {
            io.emit('update', chess.fen());
        }
    });

    socket.emit('update', chess.fen());
});

server.listen(3000, () => {
    console.log('Listening on port 3000');
});