import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Chessboard from 'chessboardjsx';
import { Chess } from 'chess.js'; // Updated import statement

const socket = io('http://localhost:3000');

const App = () => {
    const [chess, setChess] = useState(new Chess());
    const [fen, setFen] = useState(chess.fen());

    useEffect(() => {
        socket.on('update', (newFen) => {
            setFen(newFen);
            const newChess = new Chess();
            newChess.load(newFen);
            setChess(newChess);
        });

        return () => {
            socket.off('update');
        };
    }, []);

    const onDrop = ({ sourceSquare, targetSquare }) => {
        const move = {
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q', // always promote to a queen for simplicity
        };

        if (chess.move(move)) {
            setFen(chess.fen());
            socket.emit('move', move);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '50px' }}>
            <Chessboard position={fen} onDrop={onDrop} />
        </div>
    );
};

export default App;
