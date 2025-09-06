import React from 'react';
import GameBoard from '../GameBoard';

// Temporary wrapper to expose "Original" route using existing GameBoard logic.
// Later we can replace internals with the full OriginalGameBoard implementation.
const OriginalGameBoard = ({ roomId, user, socket, onExit }) => {
  return <GameBoard roomId={roomId} user={user} socket={socket} onExit={onExit} />;
};

export default OriginalGameBoard;
